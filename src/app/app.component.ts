import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

/**
 * Composant racine de l'application MacSpace.
 * Gère le splash screen, le menu Ionic et la navigation principale.
 */
@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  /** Titre de l'application */
  title = 'MacSpace';

  /** Contrôle la visibilité du splash screen */
  splashHidden = false;

  constructor(
    private menuCtrl: MenuController,
    private router: Router
  ) {}

  ngOnInit(): void {
    /* Masque le splash screen après 2.5 secondes */
    setTimeout(() => {
      this.splashHidden = true;
    }, 2500);
  }

  /**
   * Ferme le menu latéral Ionic après navigation
   */
  closeMenu() {
    this.menuCtrl.close('main-menu');
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.menuCtrl.close('main-menu');
    this.router.navigate(['/auth/login']);
  }
}