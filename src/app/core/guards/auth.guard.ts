import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

/**
 * Guard de protection des routes dans MacSpace.
 * Vérifie que l'utilisateur est authentifié avant
 * d'autoriser l'accès à une route protégée.
 * Redirige vers la page de login si non authentifié.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  /**
   * Vérifie si l'utilisateur peut accéder à la route demandée.
   * Contrôle la présence du token JWT dans le localStorage.
   *
   * @returns true si authentifié, false avec redirection sinon
   */
  canActivate(): boolean {
    /* Vérification de la présence du token JWT */
    const token = localStorage.getItem('access_token');

    if (token) {
      return true;
    }

    /* Redirection vers login si non authentifié */
    this.router.navigate(['/auth/login']);
    return false;
  }
}