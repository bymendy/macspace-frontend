import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Interfaces Data Warehouse MacSpace
 */
export interface InterventionParMois {
  annee: number;
  nomMois: string;
  mois: number;
  nbInterventions: number;
  totalProduitsUtilises: number;
  nbTerminees: number;
  tauxResolution: number;
}

export interface PerformanceTechnicien {
  nom: string;
  prenom: string;
  fonction: string;
  nbInterventions: number;
  nbTerminees: number;
  nbEnAttente: number;
  nbEnCours: number;
  tauxResolution: number;
}

export interface ProduitPlusUtilise {
  codeProduit: string;
  designation: string;
  categorie: string;
  nbMouvements: number;
  totalSorties: number;
  totalEntrees: number;
  stockNet: number;
}

export interface TableauBordGlobal {
  totalInterventions: number;
  nbTechniciensActifs: number;
  tauxResolutionGlobal: number;
  totalProduitsUtilises: number;
  totalMouvementsStock: number;
}

/**
 * Service Data Warehouse MacSpace.
 * Consomme les endpoints analytiques réservés aux ADMIN.
 */
@Injectable({
  providedIn: 'root'
})
export class DatawarehouseService {

  private apiUrl = `${environment.apiUrl}/datawarehouse`;

  constructor(private http: HttpClient) {}

  getTableauBordGlobal(): Observable<TableauBordGlobal> {
    return this.http.get<TableauBordGlobal>(`${this.apiUrl}/tableau-bord-global`);
  }

  getInterventionsParMois(): Observable<InterventionParMois[]> {
    return this.http.get<InterventionParMois[]>(`${this.apiUrl}/interventions-par-mois`);
  }

  getPerformanceTechniciens(): Observable<PerformanceTechnicien[]> {
    return this.http.get<PerformanceTechnicien[]>(`${this.apiUrl}/performance-techniciens`);
  }

  getProduitsLesPlusUtilises(): Observable<ProduitPlusUtilise[]> {
    return this.http.get<ProduitPlusUtilise[]>(`${this.apiUrl}/produits-plus-utilises`);
  }
}