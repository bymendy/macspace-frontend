import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Fournisseur } from '../../shared/models/fournisseur';

/**
 * Service de gestion des fournisseurs dans MacSpace.
 */
@Injectable({
  providedIn: 'root'
})
export class FournisseurService {

  /** URL de base de l'API fournisseurs */
  private apiUrl = `${environment.apiUrl}/fournisseurs`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste de tous les fournisseurs.
   */
  findAll(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(`${this.apiUrl}/all`);
  }

  /**
   * Récupère un fournisseur par son identifiant.
   */
  findById(id: number): Observable<Fournisseur> {
    return this.http.get<Fournisseur>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée ou modifie un fournisseur.
   */
  save(fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.http.post<Fournisseur>(
      `${this.apiUrl}/create`, fournisseur
    );
  }

  /**
   * Supprime un fournisseur par son identifiant.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}