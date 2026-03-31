import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Client } from '../../../shared/models/client';

/**
 * Composant de la liste des clients MacSpace.
 * Pagination : 15 lignes par page
 */
@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {

  /** Liste complète des clients */
  clients: Client[] = [];

  /** Liste filtrée des clients */
  clientsFiltres: Client[] = [];

  /** Indicateur de chargement */
  isLoading = true;

  /** ===== PAGINATION ===== */
  /** Page courante */
  pageCourante = 1;

  /** Nombre de lignes par page */
  lignesParPage = 15;

  constructor(
    private clientService: ClientService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  /**
   * Charge la liste des clients au démarrage.
   */
  ngOnInit(): void {
    this.loadClients();
  }

  /**
   * Charge tous les clients depuis l'API.
   */
  loadClients(): void {
    this.isLoading = true;
    this.clientService.findAll().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.clientsFiltres = clients;
        this.pageCourante = 1;
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement des clients.');
        this.isLoading = false;
      }
    });
  }

  /**
   * Filtre les clients selon le terme de recherche.
   * Remet la pagination à la page 1.
   */
  onRecherche(event: Event): void {
    const terme = (event.target as HTMLInputElement).value.toLowerCase();
    this.clientsFiltres = this.clients.filter(client =>
      client.nom.toLowerCase().includes(terme) ||
      client.prenom.toLowerCase().includes(terme) ||
      client.email.toLowerCase().includes(terme) ||
      (client.numTel && client.numTel.includes(terme))
    );
    this.pageCourante = 1;
  }

  // ===== PAGINATION =====

  /**
   * Retourne les clients de la page courante.
   */
  get clientsPage(): Client[] {
    const debut = (this.pageCourante - 1) * this.lignesParPage;
    const fin = debut + this.lignesParPage;
    return this.clientsFiltres.slice(debut, fin);
  }

  /**
   * Retourne le nombre total de pages.
   */
  get totalPages(): number {
    return Math.ceil(this.clientsFiltres.length / this.lignesParPage);
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
      this.clientsFiltres.length
    );
  }

  // ===== ACTIONS =====

  /**
   * Navigue vers le formulaire de création d'un client.
   */
  nouveauClient(): void {
    this.router.navigate(['/clients/nouveau']);
  }

  /**
   * Navigue vers le formulaire de modification d'un client.
   */
  modifierClient(id: number): void {
    this.router.navigate(['/clients/modifier', id]);
  }

  /**
   * Supprime un client après confirmation.
   */
  supprimerClient(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce client ?')) {
      this.clientService.delete(id).subscribe({
        next: () => {
          this.notificationService.success('Client supprimé avec succès.');
          this.loadClients();
        },
        error: () => {
          this.notificationService.error('Impossible de supprimer ce client.');
        }
      });
    }
  }
}