import { Adresse } from './adresse';
import { Entreprise } from './entreprise';

/**
 * Modèle représentant un utilisateur de MacSpace.
 * Un utilisateur peut être un administrateur, manager,
 * technicien ou client de Mac Sécurité.
 */
export interface Utilisateur {
  /** Identifiant unique de l'utilisateur */
  id?: number;
  /** Nom de l'utilisateur */
  nom: string;
  /** Prénom de l'utilisateur */
  prenom: string;
  /** Date de naissance de l'utilisateur */
  dateDeNaissance?: string;
  /** Fonction de l'utilisateur dans l'entreprise */
  fonction?: string;
  /** Adresse email - utilisée comme identifiant de connexion */
  email: string;
  /** Mot de passe hashé en BCrypt */
  password?: string;
  /** Adresse postale de l'utilisateur */
  adresse?: Adresse;
  /** URL de la photo de l'utilisateur */
  photo?: string;
  /** Entreprise de l'utilisateur */
  entreprise?: Entreprise;
  /** Identifiant de l'entreprise - support multi-tenant */
  idEntreprise?: number;
  /** Roles de l'utilisateur */
  roles?: Role[];
}

/**
 * Modèle représentant un rôle utilisateur dans MacSpace.
 */
export interface Role {
  /** Identifiant unique du rôle */
  id?: number;
  /** Nom du rôle - ex: ROLE_ADMIN, ROLE_TECHNICIEN */
  roleName: string;
}