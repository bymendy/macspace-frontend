import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FournisseurService } from '../../../core/services/fournisseur.service';
import { Fournisseur } from '../../../shared/models/fournisseur';

/**
 * Composant formulaire de création et modification d'un fournisseur MacSpace.
 */
@Component({
  selector: 'app-fournisseur-form',
  templateUrl: './fournisseur-form.component.html',
  styleUrls: ['./fournisseur-form.component.scss']
})
export class FournisseurFormComponent implements OnInit {

  /** Formulaire fournisseur */
  fournisseurForm: FormGroup;

  /** Indicateur de chargement */
  isLoading = false;

  /** Indicateur de modification */
  isEditMode = false;

  /** Identifiant du fournisseur en modification */
  fournisseurId: number | null = null;

  /** Message d'erreur */
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private fournisseurService: FournisseurService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    /* Initialisation du formulaire */
    this.fournisseurForm = this.fb.group({
      nom: ['', [Validators.required]],
      prenom: [''],
      email: ['', [Validators.required, Validators.email]],
      numTel: ['', [Validators.required]],
      adresse: this.fb.group({
        adresse1: ['', [Validators.required]],
        adresse2: [''],
        ville: ['', [Validators.required]],
        codePostal: ['', [Validators.required]],
        pays: ['France']
      })
    });
  }

  /**
   * Vérifie si on est en mode modification et charge le fournisseur.
   */
  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.fournisseurId = Number(id);
      this.isEditMode = true;
      this.loadFournisseur(this.fournisseurId);
    }
  }

  /**
   * Charge un fournisseur existant pour modification.
   */
  loadFournisseur(id: number): void {
    this.isLoading = true;
    this.fournisseurService.findById(id).subscribe({
      next: (fournisseur) => {
        this.fournisseurForm.patchValue(fournisseur);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement du fournisseur.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Soumet le formulaire pour créer ou modifier un fournisseur.
   */
  onSubmit(): void {
    if (this.fournisseurForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const fournisseur: Fournisseur = {
      ...this.fournisseurForm.value,
      idEntreprise: Number(localStorage.getItem('id_entreprise'))
    };

    /* Ajout de l'id en mode modification */
    if (this.isEditMode && this.fournisseurId) {
      fournisseur.id = this.fournisseurId;
    }

    this.fournisseurService.save(fournisseur).subscribe({
      next: () => {
        this.router.navigate(['/fournisseurs']);
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la sauvegarde du fournisseur.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Annule et retourne à la liste des fournisseurs.
   */
  annuler(): void {
    this.router.navigate(['/fournisseurs']);
  }
}