import { Fournisseur } from './fournisseur';
import { Produit } from './produit';

/**
 * Enumération des états possibles d'une commande fournisseur.
 */
export enum EtatCommande {
  EN_PREPARATION = 'EN_PREPARATION',
  VALIDEE = 'VALIDEE',
  LIVREE = 'LIVREE',
  ANNULEE = 'ANNULEE'
}

/**
 * Modèle représentant une ligne de commande fournisseur dans MacSpace.
 */
export interface LigneCommandeFournisseur {
  /** Identifiant unique de la ligne */
  id?: number;
  /** Produit associé à cette ligne de commande */
  produit?: Produit;
  /** Quantité commandée */
  quantite: number;
  /** Prix unitaire négocié avec le fournisseur */
  prixUnitaire: number;
  /** Identifiant de l'entreprise - support multi-tenant */
  idEntreprise?: number;
}

/**
 * Modèle représentant une commande passée à un fournisseur dans MacSpace.
 */
export interface CommandeFournisseur {
  /** Identifiant unique de la commande */
  id?: number;
  /** Code unique de la commande fournisseur */
  code: string;
  /** Date de la commande au format ISO-8601 */
  dateCommande?: string;
  /** Etat actuel de la commande */
  etatCommande: EtatCommande;
  /** Fournisseur associé à cette commande */
  fournisseur?: Fournisseur;
  /** Identifiant de l'entreprise - support multi-tenant */
  idEntreprise?: number;
  /** Liste des lignes de commande associées */
  ligneCommandeFournisseurs?: LigneCommandeFournisseur[];
  /** Indique si la commande est livrée */
  commandeLivree?: boolean;
}