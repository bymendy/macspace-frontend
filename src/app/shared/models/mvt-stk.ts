import { Produit } from './produit';

/**
 * Enumération des types de mouvements de stock dans MacSpace.
 */
export enum TypeMvtStk {
  ENTREE = 'ENTREE',
  SORTIE = 'SORTIE',
  CORRECTION_POS = 'CORRECTION_POS',
  CORRECTION_NEG = 'CORRECTION_NEG'
}

/**
 * Enumération des sources de mouvements de stock dans MacSpace.
 */
export enum SourceMvtStk {
  INTERVENTION_CLIENT = 'INTERVENTION_CLIENT',
  COMMANDE_FOURNISSEUR = 'COMMANDE_FOURNISSEUR',
  INTERVENTION = 'INTERVENTION'
}

/**
 * Modèle représentant un mouvement de stock dans MacSpace.
 * Enregistre chaque entree ou sortie de produit dans le système.
 */
export interface MvtStk {
  /** Identifiant unique du mouvement */
  id?: number;
  /** Date du mouvement au format ISO-8601 */
  dateMvt?: string;
  /** Quantité du mouvement - negative pour les sorties */
  quantite: number;
  /** Produit associé au mouvement */
  produit?: Produit;
  /** Type du mouvement de stock */
  typeMvt: TypeMvtStk;
  /** Source du mouvement de stock */
  sourceMvt?: SourceMvtStk;
  /** Identifiant de l'entreprise - support multi-tenant */
  idEntreprise?: number;
}