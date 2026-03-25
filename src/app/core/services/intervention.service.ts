import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Intervention } from '../../shared/models/intervention';

/**
 * Service de gestion des interventions dans MacSpace.
 */
@Injectable({
  providedIn: 'root'
})
export class InterventionService {

  /** URL de base de l'API interventions */
  private apiUrl = `${environment.apiUrl}/interventions`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste de toutes les interventions.
   */
  findAll(): Observable<Intervention[]> {
    return this.http.get<Intervention[]>(`${this.apiUrl}/all`);
  }

  /**
   * Récupère une intervention par son identifiant.
   */
  findById(id: number): Observable<Intervention> {
    return this.http.get<Intervention>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée ou modifie une intervention.
   */
  save(intervention: Intervention): Observable<Intervention> {
    return this.http.post<Intervention>(`${this.apiUrl}/create`, intervention);
  }

  /**
   * Supprime une intervention par son identifiant.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}