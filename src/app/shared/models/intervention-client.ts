import { Client } from './client';
import { Produit } from './produit';
import { EtatIntervention } from './intervention';

/**
 * Modèle représentant une ligne d'intervention client dans MacSpace.
 */
export interface LigneInterventionClient {
  /** Identifiant unique de la ligne */
  id?: number;
  /** Numéro de contrat associé */
  numeroContrat?: string;
  /** Produit utilisé lors de cette intervention */
  produit?: Produit;
  /** Description de la problématique rencontrée */
  problematique?: string;
  /** Quantité de produit utilisée */
  quantite: number;
  /** Identifiant de l'entreprise - support multi-tenant */
  idEntreprise?: number;
}

/**
 * Modèle représentant une intervention réalisée pour un client dans MacSpace.
 */
export interface InterventionClient {
  /** Identifiant unique de l'intervention client */
  id?: number;
  /** Code unique de l'intervention client */
  code: string;
  /** Date de l'intervention au format ISO-8601 */
  dateIntervention?: string;
  /** Client associé à cette intervention */
  client?: Client;
  /** Etat actuel de l'intervention */
  etatIntervention: EtatIntervention;
  /** Identifiant de l'entreprise - support multi-tenant */
  idEntreprise?: number;
  /** Liste des lignes d'intervention associées */
  ligneInterventionClients?: LigneInterventionClient[];
  /** Indique si l'intervention est terminée */
  interventionTerminee?: boolean;
}