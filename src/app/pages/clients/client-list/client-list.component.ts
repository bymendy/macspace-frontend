import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../shared/models/client';

/**
 * Composant de la liste des clients MacSpace.
 * Affiche tous les clients avec options de recherche et actions.
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

  /** Terme de recherche */
  recherche = '';

  /** Message d'erreur */
  errorMessage = '';

  constructor(
    private clientService: ClientService,
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
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des clients.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Filtre les clients selon le terme de recherche.
   *
   * @param event L'événement de saisie
   */
  onRecherche(event: Event): void {
    const terme = (event.target as HTMLInputElement).value.toLowerCase();
    this.recherche = terme;
    this.clientsFiltres = this.clients.filter(client =>
      client.nom.toLowerCase().includes(terme) ||
      client.prenom.toLowerCase().includes(terme) ||
      client.email.toLowerCase().includes(terme) ||
      (client.numTel && client.numTel.includes(terme))
    );
  }

  /**
   * Navigue vers le formulaire de création d'un client.
   */
  nouveauClient(): void {
    this.router.navigate(['/clients/nouveau']);
  }

  /**
   * Navigue vers le formulaire de modification d'un client.
   *
   * @param id L'identifiant du client
   */
  modifierClient(id: number): void {
    this.router.navigate(['/clients/modifier', id]);
  }

  /**
   * Supprime un client après confirmation.
   *
   * @param id L'identifiant du client
   */
  supprimerClient(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce client ?')) {
      this.clientService.delete(id).subscribe({
        next: () => {
          this.loadClients();
        },
        error: () => {
          this.errorMessage = 'Impossible de supprimer ce client.';
        }
      });
    }
  }
}