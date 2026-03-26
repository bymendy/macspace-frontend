import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilisateurService } from '../../../core/services/utilisateur.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Utilisateur } from '../../../shared/models/utilisateur';

/**
 * Composant de la liste des utilisateurs MacSpace.
 * Affiche tous les utilisateurs avec options de recherche.
 * Les actions d'ajout et suppression sont réservées aux ADMIN.
 */
@Component({
  selector: 'app-utilisateur-list',
  templateUrl: './utilisateur-list.component.html',
  styleUrls: ['./utilisateur-list.component.scss']
})
export class UtilisateurListComponent implements OnInit {

  /** Liste complète des utilisateurs */
  utilisateurs: Utilisateur[] = [];

  /** Liste filtrée des utilisateurs */
  utilisateursFiltres: Utilisateur[] = [];

  /** Indicateur de chargement */
  isLoading = true;

  /** Indique si l'utilisateur connecté est admin */
  isAdmin = false;

  constructor(
    private utilisateurService: UtilisateurService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}
  /**
   * Charge la liste des utilisateurs et vérifie le rôle admin.
   */
  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadUtilisateurs();
  }
  /**
   * Charge tous les utilisateurs depuis l'API.
   */
  loadUtilisateurs(): void {
    this.isLoading = true;
    this.utilisateurService.findAll().subscribe({
      next: (utilisateurs) => {
        this.utilisateurs = utilisateurs;
        this.utilisateursFiltres = utilisateurs;
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement des utilisateurs.');
        this.isLoading = false;
      }
    });
  }

  /**
   * Filtre les utilisateurs selon le terme de recherche.
   */
  onRecherche(event: Event): void {
    const terme = (event.target as HTMLInputElement).value.toLowerCase();
    this.utilisateursFiltres = this.utilisateurs.filter(u =>
      u.nom.toLowerCase().includes(terme) ||
      u.prenom.toLowerCase().includes(terme) ||
      u.email.toLowerCase().includes(terme) ||
      (u.fonction && u.fonction.toLowerCase().includes(terme))
    );
  }
  /**
   * Navigue vers le formulaire de création d'un utilisateur.
   * Réservé aux administrateurs.
   */
  nouvelUtilisateur(): void {
    if (!this.isAdmin) return;
    this.router.navigate(['/utilisateurs/nouveau']);
  }
  /**
   * Supprime un utilisateur après confirmation.
   * Réservé aux administrateurs.
   */
  supprimerUtilisateur(id: number): void {
    if (!this.isAdmin) return;
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.utilisateurService.delete(id).subscribe({
        next: () => {
          this.notificationService.success('Utilisateur supprimé avec succès.');
          this.loadUtilisateurs();
        },
        error: () => {
          this.notificationService.error('Impossible de supprimer cet utilisateur.');
        }
      });
    }
  }
  /**
   * Retourne les initiales d'un utilisateur.
   */
  getInitiales(utilisateur: Utilisateur): string {
    return `${utilisateur.nom.charAt(0)}${utilisateur.prenom.charAt(0)}`;
  }
  /**
   * Retourne la classe CSS du badge selon la fonction.
   */
  getFonctionBadgeClass(fonction: string): string {
    switch (fonction?.toUpperCase()) {
      case 'ADMIN': return 'badge badge-danger';
      case 'MANAGER': return 'badge badge-info';
      case 'TECHNICIEN': return 'badge badge-success';
      default: return 'badge badge-primary';
    }
  }
}