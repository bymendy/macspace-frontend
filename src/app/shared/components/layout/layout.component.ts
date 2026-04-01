import { Component, HostListener } from '@angular/core';

/**
 * Composant layout principal de MacSpace.
 * Structure la page avec la sidebar, le header et le contenu dynamique.
 * Gère l'ouverture/fermeture de la sidebar sur mobile.
 */
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {

  /** État du menu mobile */
  menuMobileOuvert = false;

  /**
   * Ouvre/ferme le menu mobile.
   */
  toggleMenuMobile(): void {
    this.menuMobileOuvert = !this.menuMobileOuvert;
  }

  /**
   * Ferme le menu mobile.
   */
  fermerMenuMobile(): void {
    this.menuMobileOuvert = false;
  }

  /**
   * Ferme le menu mobile si on clique en dehors.
   */
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.menuMobileOuvert = false;
  }
}