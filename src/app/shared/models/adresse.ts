/**
 * Modèle représentant une adresse dans MacSpace.
 */
export interface Adresse {
  id?: number;
  adresse1: string;
  adresse2?: string;
  ville: string;
  codePostal: string;
  pays: string;
}