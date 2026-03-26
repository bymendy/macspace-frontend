import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Utilisateur } from '../../shared/models/utilisateur';

/**
 * Service de gestion des utilisateurs dans MacSpace.
 */
@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {

  /** URL de base de l'API utilisateurs */
  private apiUrl = `${environment.apiUrl}/utilisateurs`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste de tous les utilisateurs.
   */
  findAll(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.apiUrl}/all`);
  }

  /**
   * Récupère un utilisateur par son identifiant.
   */
  findById(id: number): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.apiUrl}/${id}`);
  }
  /**
 * Récupère un utilisateur par son email.
 *
 * @param email L'email de l'utilisateur
 * @returns Observable de l'utilisateur trouvé
 */
  findByEmail(email: string): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(
      `${this.apiUrl}/find/${encodeURIComponent(email)}`
    );
  }
  /**
   * Crée ou modifie un utilisateur.
   */
  save(utilisateur: Utilisateur): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(
      `${this.apiUrl}/create`, utilisateur
    );
  }

  /**
   * Supprime un utilisateur par son identifiant.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}