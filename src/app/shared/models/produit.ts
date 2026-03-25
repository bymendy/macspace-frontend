import { Categorie } from './categorie';
import { Fournisseur } from './fournisseur';

/**
 * Modèle représentant un produit de sécurité dans MacSpace.
 * Un produit est un équipement ou service géré dans le stock.
 */
export interface Produit {
  /** Identifiant unique du produit */
  id?: number;
  /** Code unique du produit */
  codeProduit: string;
  /** Désignation ou nom du produit */
  designation: string;
  /** Prix unitaire hors taxes */
  prixUnitaireHt: number;
  /** Taux de TVA appliqué */
  tauxTva: number;
  /** Prix unitaire toutes taxes comprises */
  prixUnitaireTtc: number;
  /** URL de la photo du produit */
  photo?: string;
  /** Catégorie du produit */
  category?: Categorie;
  /** Fournisseur du produit */
  fournisseur?: Fournisseur;
  /** Identifiant de l'entreprise - support multi-tenant */
  idEntreprise?: number;
}