import { Utilisateur } from './utilisateur';
import { Produit } from './produit';

/**
 * Enumération des états possibles d'une intervention.
 */
export enum EtatIntervention {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
  ANNULEE = 'ANNULEE'
}

/**
 * Modèle représentant une ligne d'intervention dans MacSpace.
 */
export interface LigneIntervention {
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
 * Modèle représentant une intervention technique dans MacSpace.
 * Une intervention est une opération terrain liée à un système de sécurité.
 */
export interface Intervention {
  /** Identifiant unique de l'intervention */
  id?: number;
  /** Code unique de l'intervention */
  code: string;
  /** Date de l'intervention au format ISO-8601 */
  dateIntervention?: string;
  /** Description de la problématique rencontrée */
  problematique?: string;
  /** Etat actuel de l'intervention */
  etatIntervention: EtatIntervention;
  /** Technicien responsable de l'intervention */
  technicien?: Utilisateur;
  /** Identifiant de l'entreprise - support multi-tenant */
  idEntreprise?: number;
  /** Liste des lignes d'intervention associées */
  ligneInterventions?: LigneIntervention[];
}