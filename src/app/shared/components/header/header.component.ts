import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Composant du header principal de MacSpace.
 * Affiche les informations rapides et les actions globales.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(private authService: AuthService) {}

  /**
   * Déconnecte l'utilisateur.
   */
  logout(): void {
    this.authService.logout();
  }
}