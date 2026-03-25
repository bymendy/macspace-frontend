import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Composant de la barre de navigation latérale de MacSpace.
 * Affiche les liens de navigation et gère la déconnexion.
 */
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  /** Etat du menu - ouvert ou réduit */
  isCollapsed = false;

  /** Liens de navigation */
  navItems = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'dashboard'
    },
    {
      label: 'Interventions',
      route: '/interventions',
      icon: 'build'
    },
    {
      label: 'Clients',
      route: '/clients',
      icon: 'people'
    },
    {
      label: 'Produits',
      route: '/produits',
      icon: 'inventory_2'
    },
    {
      label: 'Stock',
      route: '/stock',
      icon: 'warehouse'
    },
    {
      label: 'Fournisseurs',
      route: '/fournisseurs',
      icon: 'local_shipping'
    },
    {
      label: 'Utilisateurs',
      route: '/utilisateurs',
      icon: 'manage_accounts'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Bascule l'état ouvert/réduit de la sidebar.
   */
  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  /**
   * Déconnecte l'utilisateur et redirige vers le login.
   */
  logout(): void {
    this.authService.logout();
  }

  /**
   * Vérifie si la route est active.
   *
   * @param route La route à vérifier
   * @returns true si la route est active
   */
  isActive(route: string): boolean {
    return this.router.url === route;
  }
}