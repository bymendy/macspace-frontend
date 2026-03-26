import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UtilisateurService } from '../../../core/services/utilisateur.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Utilisateur } from '../../../shared/models/utilisateur';

/**
 * Composant formulaire de création d'un utilisateur MacSpace.
 * Accessible uniquement aux administrateurs.
 */
@Component({
  selector: 'app-utilisateur-form',
  templateUrl: './utilisateur-form.component.html',
  styleUrls: ['./utilisateur-form.component.scss']
})
export class UtilisateurFormComponent implements OnInit {

  /** Formulaire utilisateur */
  utilisateurForm: FormGroup;

  /** Indicateur de chargement */
  isLoading = false;

  /** Afficher/masquer le mot de passe */
  showPassword = false;

  /** Fonctions disponibles */
  fonctions = [
    { value: 'ADMIN', label: 'Administrateur' },
    { value: 'MANAGER', label: 'Manager' },
    { value: 'TECHNICIEN', label: 'Technicien' }
  ];

  constructor(
    private fb: FormBuilder,
    private utilisateurService: UtilisateurService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    /* Initialisation du formulaire */
    this.utilisateurForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fonction: ['TECHNICIEN', [Validators.required]],
      idEntreprise: [Number(localStorage.getItem('id_entreprise'))]
    });
  }
  /**
   * Vérifie si l'utilisateur est admin au démarrage.
   */
  ngOnInit(): void {}
  /**
   * Bascule l'affichage du mot de passe.
   */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
  /**
   * Soumet le formulaire pour créer un utilisateur.
   */
  onSubmit(): void {
    if (this.utilisateurForm.invalid) return;

    this.isLoading = true;

    const idEntreprise = Number(localStorage.getItem('id_entreprise'));

    const utilisateur: Utilisateur = {
      ...this.utilisateurForm.value,
      idEntreprise: idEntreprise,
      /* Ajout de l'objet entreprise requis par le backend */
      entreprise: {
        id: idEntreprise,
        nom: 'Mac Sécurité'
      }
    };

    this.utilisateurService.save(utilisateur).subscribe({
      next: () => {
        this.notificationService.success('Utilisateur créé avec succès.');
        this.router.navigate(['/utilisateurs']);
      },
      error: (error) => {
        if (error.status === 400) {
          this.notificationService.error('Un utilisateur avec cet email existe déjà.');
        } else {
          this.notificationService.error('Erreur lors de la création de l utilisateur.');
        }
        this.isLoading = false;
      }
    });
  }
  /**
   * Annule et retourne à la liste des utilisateurs.
   */
  annuler(): void {
    this.router.navigate(['/utilisateurs']);
  }
}