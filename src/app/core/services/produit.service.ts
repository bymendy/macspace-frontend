import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Produit } from '../../shared/models/produit';

/**
 * Service de gestion des produits dans MacSpace.
 */
@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  /** URL de base de l'API produits */
  private apiUrl = `${environment.apiUrl}/produits`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste de tous les produits.
   */
  findAll(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/all`);
  }

  /**
   * Récupère un produit par son identifiant.
   */
  findById(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée ou modifie un produit.
   */
  save(produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(`${this.apiUrl}/create`, produit);
  }

  /**
   * Supprime un produit par son identifiant.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}