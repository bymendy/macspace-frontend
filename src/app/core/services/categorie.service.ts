import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Categorie } from '../../shared/models/categorie';

/**
 * Service de gestion des catégories dans MacSpace.
 */
@Injectable({
  providedIn: 'root'
})
export class CategorieService {

  /** URL de base de l'API catégories */
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste de toutes les catégories.
   */
  findAll(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.apiUrl}/all`);
  }

  /**
   * Récupère une catégorie par son identifiant.
   */
  findById(id: number): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée ou modifie une catégorie.
   */
  save(categorie: Categorie): Observable<Categorie> {
    return this.http.post<Categorie>(
      `${this.apiUrl}/create`, categorie
    );
  }

  /**
   * Supprime une catégorie par son identifiant.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}