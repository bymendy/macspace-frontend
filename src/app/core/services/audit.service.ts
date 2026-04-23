import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Modèle d'un log d'audit MacSpace.
 */
export interface AuditLog {
  id: number;
  utilisateurNom: string;
  action: string;
  entite: string;
  entiteId: number;
  detail: string;
  ipAddress: string;
  idEntreprise: number;
  createdAt: string;
}

/**
 * Service Angular pour la gestion des logs d'audit MacSpace.
 */
@Injectable({ providedIn: 'root' })
export class AuditService {

    private apiUrl = `${environment.apiUrl}/audit`;

  constructor(private http: HttpClient) {}

  /** Récupère tous les logs de l'entreprise */
  findAll(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(this.apiUrl);
  }

  /** Récupère les logs par entité */
  findByEntite(entite: string): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.apiUrl}/entite/${entite}`);
  }

  /** Récupère les logs par utilisateur */
  findByUtilisateur(utilisateurId: number): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.apiUrl}/utilisateur/${utilisateurId}`);
  }
}