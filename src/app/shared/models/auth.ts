/**
 * Modèle représentant une demande d'authentification dans MacSpace.
 * Contient les informations nécessaires pour identifier un utilisateur.
 */
export interface AuthRequest {
  /** Adresse email de l'utilisateur - utilisée comme identifiant de connexion */
  email: string;
  /** Mot de passe de l'utilisateur */
  password: string;
}

/**
 * Modèle représentant la réponse d'authentification dans MacSpace.
 * Retournée après une authentification réussie.
 */
export interface AuthResponse {
  /** Token JWT d'accès attribué après authentification */
  accessToken: string;
  /** Type du token - toujours Bearer pour JWT */
  tokenType: string;
  /** Identifiant de l'entreprise de l'utilisateur connecté - support multi-tenant */
  idEntreprise: number;
}