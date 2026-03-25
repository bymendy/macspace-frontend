import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InterventionService } from '../../../core/services/intervention.service';
import { UtilisateurService } from '../../../core/services/utilisateur.service';
import { Intervention, EtatIntervention } from '../../../shared/models/intervention';
import { Utilisateur } from '../../../shared/models/utilisateur';

/**
 * Composant formulaire de création et modification d'une intervention MacSpace.
 */
@Component({
  selector: 'app-intervention-form',
  templateUrl: './intervention-form.component.html',
  styleUrls: ['./intervention-form.component.scss']
})
export class InterventionFormComponent implements OnInit {

  /** Formulaire intervention */
  interventionForm: FormGroup;

  /** Indicateur de chargement */
  isLoading = false;

  /** Indicateur de modification */
  isEditMode = false;

  /** Identifiant de l'intervention en modification */
  interventionId: number | null = null;

  /** Message d'erreur */
  errorMessage = '';

  /** Liste des techniciens */
  techniciens: Utilisateur[] = [];

  /** Etats disponibles */
  etats = [
    { value: EtatIntervention.EN_ATTENTE, label: 'En attente' },
    { value: EtatIntervention.EN_COURS, label: 'En cours' },
    { value: EtatIntervention.TERMINEE, label: 'Terminée' },
    { value: EtatIntervention.ANNULEE, label: 'Annulée' }
  ];

  constructor(
    private fb: FormBuilder,
    private interventionService: InterventionService,
    private utilisateurService: UtilisateurService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    /* Initialisation du formulaire */
    this.interventionForm = this.fb.group({
      code: ['', [Validators.required]],
      dateIntervention: ['', [Validators.required]],
      etatIntervention: [EtatIntervention.EN_ATTENTE, [Validators.required]],
      problematique: [''],
      technicienId: ['', [Validators.required]]
    });
  }

  /**
   * Charge les techniciens et l'intervention si modification.
   */
  ngOnInit(): void {
    this.loadTechniciens();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.interventionId = Number(id);
      this.isEditMode = true;
      this.loadIntervention(this.interventionId);
    }
  }

  /**
   * Charge tous les utilisateurs comme techniciens.
   */
  loadTechniciens(): void {
    this.utilisateurService.findAll().subscribe({
      next: (utilisateurs) => {
        this.techniciens = utilisateurs;
      }
    });
  }

  /**
   * Charge une intervention existante pour modification.
   */
  loadIntervention(id: number): void {
    this.isLoading = true;
    this.interventionService.findById(id).subscribe({
      next: (intervention) => {
        const date = intervention.dateIntervention
          ? new Date(intervention.dateIntervention)
              .toISOString().split('T')[0]
          : '';
        this.interventionForm.patchValue({
          code: intervention.code,
          dateIntervention: date,
          etatIntervention: intervention.etatIntervention,
          problematique: intervention.problematique,
          technicienId: intervention.technicien?.id
        });
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement de l intervention.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Soumet le formulaire pour créer ou modifier une intervention.
   */
  onSubmit(): void {
    if (this.interventionForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.interventionForm.value;

    const technicienSelectionne = this.techniciens.find(
      t => t.id === Number(formValue.technicienId)
    );

    const intervention: Intervention = {
      code: formValue.code,
      dateIntervention: new Date(formValue.dateIntervention).toISOString(),
      etatIntervention: formValue.etatIntervention,
      problematique: formValue.problematique,
      technicien: technicienSelectionne,
      idEntreprise: Number(localStorage.getItem('id_entreprise'))
    };

    /* Ajout de l'id en mode modification */
    if (this.isEditMode && this.interventionId) {
      intervention.id = this.interventionId;
    }

    this.interventionService.save(intervention).subscribe({
      next: () => {
        this.router.navigate(['/interventions']);
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la sauvegarde de l intervention.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Annule et retourne à la liste des interventions.
   */
  annuler(): void {
    this.router.navigate(['/interventions']);
  }
}