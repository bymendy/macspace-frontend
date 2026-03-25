import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Client } from '../../shared/models/client';

/**
 * Service de gestion des clients dans MacSpace.
 * Communique avec l'API REST du backend Spring Boot.
 */
@Injectable({
  providedIn: 'root'
})
export class ClientService {

  /** URL de base de l'API clients */
  private apiUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste de tous les clients.
   *
   * @returns Observable de la liste des clients
   */
  findAll(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/all`);
  }

  /**
   * Récupère un client par son identifiant.
   *
   * @param id L'identifiant du client
   * @returns Observable du client trouvé
   */
  findById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crée ou modifie un client.
   *
   * @param client Les données du client
   * @returns Observable du client sauvegardé
   */
  save(client: Client): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/create`, client);
  }

  /**
   * Supprime un client par son identifiant.
   *
   * @param id L'identifiant du client à supprimer
   * @returns Observable void
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}