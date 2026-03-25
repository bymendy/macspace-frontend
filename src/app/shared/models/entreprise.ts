import { Adresse } from './adresse';
/**
 * Modèle représentant une entreprise dans MacSpace.
 */
export interface Entreprise {
  id?: number;
  nom: string;
  description?: string;
  codeFiscal?: string;
  adresse?: Adresse;
  email?: string;
  numTel?: string;
  siteWeb?: string;
  photo?: string;
  idEntreprise?: number;
}