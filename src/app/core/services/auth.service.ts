import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthRequest, AuthResponse } from '../../shared/models/auth';

/**
 * Service d'authentification pour MacSpace.
 * Gère la connexion, la déconnexion et le stockage du token JWT.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /** URL de base de l'API */
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Authentifie un utilisateur avec ses credentials.
   * Stocke le token JWT et l'idEntreprise dans le localStorage.
   *
   * @param credentials Les credentials de l'utilisateur
   * @returns Observable de la réponse d'authentification
   */
  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/auth/authenticate`,
      credentials
    ).pipe(
      tap((response: AuthResponse) => {
        /* Stockage du token JWT */
        localStorage.setItem('access_token', response.accessToken);
        /* Stockage de l'idEntreprise pour le multi-tenant */
        localStorage.setItem('id_entreprise',
          response.idEntreprise.toString());
      })
    );
  }

  /**
   * Déconnecte l'utilisateur en supprimant les données de session.
   * Redirige vers la page de login.
   */
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_entreprise');
    this.router.navigate(['/auth/login']);
  }

  /**
   * Vérifie si l'utilisateur est actuellement authentifié.
   *
   * @returns true si un token JWT est présent dans le localStorage
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  /**
   * Retourne le token JWT stocké dans le localStorage.
   *
   * @returns Le token JWT ou null si non authentifié
   */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Retourne l'identifiant de l'entreprise de l'utilisateur connecté.
   *
   * @returns L'idEntreprise ou null si non authentifié
   */
  getIdEntreprise(): number | null {
    const id = localStorage.getItem('id_entreprise');
    return id ? parseInt(id) : null;
  }
}