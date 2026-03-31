import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InterventionService } from '../../../core/services/intervention.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Intervention, EtatIntervention } from '../../../shared/models/intervention';

/**
 * Composant de la liste des interventions MacSpace.
 * Compatible Web (tableau) et Mobile Ionic (ion-list)
 * Pagination : 15 lignes par page
 */
@Component({
  selector: 'app-intervention-list',
  templateUrl: './intervention-list.component.html',
  styleUrls: ['./intervention-list.component.scss']
})
export class InterventionListComponent implements OnInit {

  /** Liste complète des interventions */
  interventions: Intervention[] = [];

  /** Liste filtrée des interventions */
  interventionsFiltrees: Intervention[] = [];

  /** Indicateur de chargement */
  isLoading = true;

  /** Filtre par état actif */
  filtreEtat = 'TOUS';

  /** ===== PAGINATION ===== */
  /** Page courante */
  pageCourante = 1;

  /** Nombre de lignes par page */
  lignesParPage = 15;

  /** Etats disponibles pour les filtres */
  etats = [
    { value: 'TOUS', label: 'Tous les états' },
    { value: 'En attente', label: 'En attente' },
    { value: 'En cours', label: 'En cours' },
    { value: 'Terminée', label: 'Terminées' },
    { value: 'Annulée', label: 'Annulées' }
  ];

  constructor(
    private interventionService: InterventionService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  /**
   * Charge la liste des interventions au démarrage.
   */
  ngOnInit(): void {
    this.loadInterventions();
  }

  /**
   * Charge toutes les interventions depuis l'API.
   */
  loadInterventions(): void {
    this.isLoading = true;
    this.interventionService.findAll().subscribe({
      next: (interventions) => {
        this.interventions = interventions;
        this.interventionsFiltrees = interventions;
        this.pageCourante = 1;
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement des interventions.');
        this.isLoading = false;
      }
    });
  }

  /**
   * Filtre les interventions par terme de recherche.
   */
  onRecherche(event: Event): void {
    const terme = (event.target as HTMLInputElement).value.toLowerCase();
    this.appliquerFiltres(terme);
  }

  /**
   * Filtre les interventions par état.
   */
  onFiltreEtat(etat: string): void {
    this.filtreEtat = etat;
    this.appliquerFiltres('');
  }

  /**
   * Applique les filtres recherche et état combinés.
   * Remet la pagination à la page 1.
   */
  appliquerFiltres(terme: string): void {
    this.interventionsFiltrees = this.interventions.filter(i => {
      const matchTerme = terme === '' ||
        i.code.toLowerCase().includes(terme) ||
        (i.technicien?.nom.toLowerCase().includes(terme)) ||
        (i.technicien?.prenom.toLowerCase().includes(terme));

      const matchEtat = this.filtreEtat === 'TOUS' ||
        (i.etatIntervention as any) === this.filtreEtat;

      return matchTerme && matchEtat;
    });
    /* Revenir à la page 1 après filtrage */
    this.pageCourante = 1;
  }

  // ===== PAGINATION =====

  /**
   * Retourne les interventions de la page courante.
   */
  get interventionsPage(): Intervention[] {
    const debut = (this.pageCourante - 1) * this.lignesParPage;
    const fin = debut + this.lignesParPage;
    return this.interventionsFiltrees.slice(debut, fin);
  }

  /**
   * Retourne le nombre total de pages.
   */
  get totalPages(): number {
    return Math.ceil(this.interventionsFiltrees.length / this.lignesParPage);
  }

  /**
   * Retourne la liste des numéros de pages.
   */
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  /**
   * Navigue vers une page spécifique.
   */
  allerPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageCourante = page;
    }
  }

  /**
   * Retourne l'index de début de la page courante.
   */
  get debutPage(): number {
    return (this.pageCourante - 1) * this.lignesParPage + 1;
  }

  /**
   * Retourne l'index de fin de la page courante.
   */
  get finPage(): number {
    return Math.min(
      this.pageCourante * this.lignesParPage,
      this.interventionsFiltrees.length
    );
  }

  // ===== ACTIONS =====

  /**
   * Navigue vers le formulaire de création d'une intervention.
   */
  nouvelleIntervention(): void {
    this.router.navigate(['/interventions/nouvelle']);
  }

  /**
   * Navigue vers le formulaire de modification d'une intervention.
   */
  modifierIntervention(id: number): void {
    this.router.navigate(['/interventions/modifier', id]);
  }

  /**
   * Supprime une intervention après confirmation.
   */
  supprimerIntervention(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette intervention ?')) {
      this.interventionService.delete(id).subscribe({
        next: () => {
          this.notificationService.success('Intervention supprimée avec succès.');
          this.loadInterventions();
        },
        error: () => {
          this.notificationService.error('Impossible de supprimer cette intervention.');
        }
      });
    }
  }

  /**
   * Retourne la classe CSS du badge selon l'état.
   */
  getBadgeClass(etat: string): string {
    switch (etat) {
      case 'En attente': return 'badge badge-warning';
      case 'En cours': return 'badge badge-info';
      case 'Terminée': return 'badge badge-success';
      case 'Annulée': return 'badge badge-danger';
      default: return 'badge';
    }
  }

  /**
   * Formate la date de l'intervention en français.
   */
  formatDate(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  }

  /**
   * Retourne l'icône Ionic selon l'état de l'intervention.
   */
  getIonicIcon(etat: string): string {
    switch (etat) {
      case 'En attente': return 'time-outline';
      case 'En cours': return 'construct-outline';
      case 'Terminée': return 'checkmark-circle-outline';
      case 'Annulée': return 'close-circle-outline';
      default: return 'help-outline';
    }
  }

  /**
   * Retourne la couleur Ionic selon l'état de l'intervention.
   */
  getIonicColor(etat: string): string {
    switch (etat) {
      case 'En attente': return 'warning';
      case 'En cours': return 'primary';
      case 'Terminée': return 'success';
      case 'Annulée': return 'danger';
      default: return 'medium';
    }
  }
}