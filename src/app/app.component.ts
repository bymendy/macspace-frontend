import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Composant racine de l'application MacSpace.
 * Point d'entrée principal qui affiche les routes de l'application.
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
}