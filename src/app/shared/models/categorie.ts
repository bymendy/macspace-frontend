/**
 * Modèle représentant une catégorie de produits dans MacSpace.
 */
export interface Categorie {
  /** Identifiant unique de la catégorie */
  id?: number;
  /** Code unique de la catégorie */
  code: string;
  /** Désignation ou libellé de la catégorie */
  designation: string;
  /** Identifiant de l'entreprise - support multi-tenant */
  idEntreprise?: number;
}