import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

/**
 * Composant racine de l'application MacSpace.
 * Gère le menu Ionic et la navigation principale.
 */
@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
  /** Titre de l'application */
  title = 'MacSpace';

  constructor(
    private menuCtrl: MenuController, // Contrôleur du menu Ionic
    private router: Router            // Service de navigation Angular
  ) {}

  /**
   * Ferme le menu latéral Ionic après navigation
   */
  closeMenu() {
    this.menuCtrl.close('main-menu');
  }

  /**
   * Déconnecte l'utilisateur :
   * - Supprime le token JWT du localStorage
   * - Supprime les infos utilisateur
   * - Ferme le menu
   * - Redirige vers la page de login
   */
  logout() {
    localStorage.removeItem('token');  // Supprime le token JWT
    localStorage.removeItem('user');   // Supprime les infos utilisateur
    this.menuCtrl.close('main-menu'); // Ferme le menu
    this.router.navigate(['/auth/login']); // Redirige vers login
  }
}