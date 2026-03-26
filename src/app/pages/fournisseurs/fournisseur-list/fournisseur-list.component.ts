import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FournisseurService } from '../../../core/services/fournisseur.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Fournisseur } from '../../../shared/models/fournisseur';

/**
 * Composant de la liste des fournisseurs MacSpace.
 */
@Component({
  selector: 'app-fournisseur-list',
  templateUrl: './fournisseur-list.component.html',
  styleUrls: ['./fournisseur-list.component.scss']
})
export class FournisseurListComponent implements OnInit {

  /** Liste complète des fournisseurs */
  fournisseurs: Fournisseur[] = [];

  /** Liste filtrée des fournisseurs */
  fournisseursFiltres: Fournisseur[] = [];

  /** Indicateur de chargement */
  isLoading = true;

  constructor(
    private fournisseurService: FournisseurService,
    private notificationService: NotificationService,
    private router: Router
  ) {}
  /**
   * Charge la liste des fournisseurs au démarrage.
   */
  ngOnInit(): void {
    this.loadFournisseurs();
  }
  /**
   * Charge tous les fournisseurs depuis l'API.
   */
  loadFournisseurs(): void {
    this.isLoading = true;
    this.fournisseurService.findAll().subscribe({
      next: (fournisseurs) => {
        this.fournisseurs = fournisseurs;
        this.fournisseursFiltres = fournisseurs;
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement des fournisseurs.');
        this.isLoading = false;
      }
    });
  }
  /**
   * Filtre les fournisseurs selon le terme de recherche.
   */
  onRecherche(event: Event): void {
    const terme = (event.target as HTMLInputElement).value.toLowerCase();
    this.fournisseursFiltres = this.fournisseurs.filter(f =>
      f.nom.toLowerCase().includes(terme) ||
      f.email.toLowerCase().includes(terme) ||
      (f.numTel && f.numTel.includes(terme))
    );
  }
  /**
   * Navigue vers le formulaire de création.
   */
  nouveauFournisseur(): void {
    this.router.navigate(['/fournisseurs/nouveau']);
  }
  /**
   * Navigue vers le formulaire de modification.
   */
  modifierFournisseur(id: number): void {
    this.router.navigate(['/fournisseurs/modifier', id]);
  }
  /**
   * Supprime un fournisseur après confirmation.
   */
  supprimerFournisseur(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce fournisseur ?')) {
      this.fournisseurService.delete(id).subscribe({
        next: () => {
          this.notificationService.success('Fournisseur supprimé avec succès.');
          this.loadFournisseurs();
        },
        error: () => {
          this.notificationService.error('Impossible de supprimer ce fournisseur.');
        }
      });
    }
  }
}