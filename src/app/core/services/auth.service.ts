import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthRequest, AuthResponse } from '../../shared/models/auth';

/**
 * Service d'authentification pour MacSpace.
 * Gère la connexion, la déconnexion, le stockage du token JWT
 * et la vérification du rôle de l'utilisateur connecté.
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

        /* Décoder le token pour extraire l'email */
        const email = this.getEmailFromToken(response.accessToken);
        if (email) {
          localStorage.setItem('user_email', email);
        }

        /* Charger la fonction de l'utilisateur après authentification */
        this.loadUserFonction();
      })
    );
  }

  /**
   * Charge et stocke la fonction de l'utilisateur connecté.
   */
  loadUserFonction(): void {
    const email = this.getUserEmail();
    if (!email) return;

    this.http.get<any>(
      `${this.apiUrl}/utilisateurs/find/${email}`
    ).subscribe({
      next: (utilisateur) => {
        if (utilisateur?.fonction) {
          localStorage.setItem('user_fonction', utilisateur.fonction);
        }
      }
    });
  }

  /**
   * Déconnecte l'utilisateur en supprimant les données de session.
   */
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_entreprise');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_fonction');
    this.router.navigate(['/auth/login']);
  }

  /**
   * Vérifie si l'utilisateur est actuellement authentifié.
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  /**
   * Retourne le token JWT stocké dans le localStorage.
   */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Retourne l'identifiant de l'entreprise de l'utilisateur connecté.
   */
  getIdEntreprise(): number | null {
    const id = localStorage.getItem('id_entreprise');
    return id ? parseInt(id) : null;
  }

  /**
   * Retourne l'email de l'utilisateur connecté.
   */
  getUserEmail(): string | null {
    return localStorage.getItem('user_email');
  }

  /**
   * Retourne la fonction de l'utilisateur connecté.
   */
  getUserFonction(): string | null {
    return localStorage.getItem('user_fonction');
  }

  /**
   * Vérifie si l'utilisateur connecté est ADMIN.
   */
  isAdmin(): boolean {
    const fonction = localStorage.getItem('user_fonction');
    if (!fonction) {
      /* Si la fonction n'est pas encore chargée on recharge */
      this.loadUserFonction();
      return false;
    }
    return fonction.toUpperCase() === 'ADMIN';
  }
  /**
   * Décode le token JWT et extrait l'email.
   *
   * @param token Le token JWT
   * @returns L'email extrait ou null
   */
  getEmailFromToken(token: string): string | null {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.sub || null;
    } catch {
      return null;
    }
  }
}