import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AuthRequest } from '../../../shared/models/auth';

/**
 * Composant de la page de connexion MacSpace.
 * Gère l'authentification de l'utilisateur via JWT.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  /** Formulaire de connexion */
  loginForm: FormGroup;

  /** Indicateur de chargement */
  isLoading = false;

  /** Message d'erreur à afficher */
  errorMessage = '';

  /** Afficher/masquer le mot de passe */
  showPassword = false;

  /** Année courante pour le footer */
  currentYear = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    /* Initialisation du formulaire avec validation */
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Retourne le contrôle email du formulaire.
   */
  get email() {
    return this.loginForm.get('email');
  }

  /**
   * Retourne le contrôle password du formulaire.
   */
  get password() {
    return this.loginForm.get('password');
  }

  /**
   * Soumet le formulaire de connexion.
   * Authentifie l'utilisateur et redirige vers le dashboard.
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const credentials: AuthRequest = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: () => {
        /* Redirection vers le dashboard après connexion */
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 500 || error.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect.';
        } else {
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  /**
   * Bascule l'affichage du mot de passe.
   */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}