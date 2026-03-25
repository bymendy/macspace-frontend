import { Adresse } from './adresse';

/**
 * Modèle représentant un client de Mac Sécurité dans MacSpace.
 */
export interface Client {
  /** Identifiant unique du client */
  id?: number;
  /** Nom du client */
  nom: string;
  /** Prénom du client */
  prenom: string;
  /** Adresse postale du client */
  adresse?: Adresse;
  /** URL de la photo du client */
  photo?: string;
  /** Adresse email du client */
  email: string;
  /** Numéro de téléphone du client */
  numTel?: string;
  /** Identifiant de l'entreprise - support multi-tenant */
  idEntreprise?: number;
}