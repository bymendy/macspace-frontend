import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Composant de la page d'accueil MacSpace.
 * Page explicative premium avec image de fond et présentation des fonctionnalités.
 */
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  /** Référence vers la section fonctionnalités */
  @ViewChild('featuresSection') featuresSection!: ElementRef;

  constructor(private router: Router) {}

  /**
   * Redirige vers la page de connexion.
   */
  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  /**
   * Fait défiler vers la section fonctionnalités.
   */
  scrollToFeatures(): void {
    this.featuresSection?.nativeElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}
