import { Adresse } from './adresse';

/**
 * Modèle représentant un fournisseur de produits de sécurité dans MacSpace.
 */
export interface Fournisseur {
  /** Identifiant unique du fournisseur */
  id?: number;
  /** Nom du fournisseur */
  nom: string;
  /** Prénom du fournisseur */
  prenom?: string;
  /** Adresse postale du fournisseur */
  adresse?: Adresse;
  /** URL de la photo du fournisseur */
  photo?: string;
  /** Adresse email du fournisseur */
  email: string;
  /** Numéro de téléphone du fournisseur */
  numTel: string;
  /** Identifiant de l'entreprise - support multi-tenant */
  idEntreprise?: number;
}