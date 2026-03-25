import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MvtStk, TypeMvtStk } from '../../shared/models/mvt-stk';

/**
 * Service de gestion des mouvements de stock dans MacSpace.
 */
@Injectable({
  providedIn: 'root'
})
export class StockService {

  /** URL de base de l'API stock */
  private apiUrl = `${environment.apiUrl}/mvtstk`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère le stock réel d'un produit.
   */
  stockReelProduit(idProduit: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/stockreel/${idProduit}`
    );
  }

  /**
   * Récupère les mouvements de stock d'un produit.
   */
  findAllByProduit(idProduit: number): Observable<MvtStk[]> {
    return this.http.get<MvtStk[]>(
      `${this.apiUrl}/filter/produit/${idProduit}`
    );
  }

  /**
   * Récupère les mouvements par type.
   */
  findAllByType(typeMvt: TypeMvtStk): Observable<MvtStk[]> {
    return this.http.get<MvtStk[]>(
      `${this.apiUrl}/filter/type/${typeMvt}`
    );
  }

  /**
   * Enregistre une entrée de stock.
   */
  entreeStock(mvtStk: MvtStk): Observable<MvtStk> {
    return this.http.post<MvtStk>(`${this.apiUrl}/entree`, mvtStk);
  }

  /**
   * Enregistre une sortie de stock.
   */
  sortieStock(mvtStk: MvtStk): Observable<MvtStk> {
    return this.http.post<MvtStk>(`${this.apiUrl}/sortie`, mvtStk);
  }

  /**
   * Enregistre une correction positive de stock.
   */
  correctionPos(mvtStk: MvtStk): Observable<MvtStk> {
    return this.http.post<MvtStk>(
      `${this.apiUrl}/correctionpos`, mvtStk
    );
  }

  /**
   * Enregistre une correction négative de stock.
   */
  correctionNeg(mvtStk: MvtStk): Observable<MvtStk> {
    return this.http.post<MvtStk>(
      `${this.apiUrl}/correctionneg`, mvtStk
    );
  }
}