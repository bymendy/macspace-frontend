import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { InterventionService } from '../../../core/services/intervention.service';
import { UtilisateurService } from '../../../core/services/utilisateur.service';
import { ProduitService } from '../../../core/services/produit.service';
import { StockService } from '../../../core/services/stock.service';
import { Intervention, EtatIntervention, LigneIntervention } from '../../../shared/models/intervention';
import { Utilisateur } from '../../../shared/models/utilisateur';
import { Produit } from '../../../shared/models/produit';

/**
 * Composant formulaire de création et modification d'une intervention MacSpace.
 * Gère les lignes de produits utilisés avec décompte du stock.
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
  isLoading = true;

  /** Indicateur de modification */
  isEditMode = false;

  /** Identifiant de l'intervention en modification */
  interventionId: number | null = null;

  /** Message d'erreur */
  errorMessage = '';

  /** Liste des techniciens */
  techniciens: Utilisateur[] = [];

  /** Liste des produits */
  produits: Produit[] = [];

  /** Stock réel par produit - clé = idProduit, valeur = stock */
  stockParProduit: Map<number, number> = new Map();

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
    private produitService: ProduitService,
    private stockService: StockService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    /* Initialisation du formulaire */
    this.interventionForm = this.fb.group({
      code: ['', [Validators.required]],
      dateIntervention: ['', [Validators.required]],
      etatIntervention: [EtatIntervention.EN_ATTENTE, [Validators.required]],
      problematique: [''],
      technicienId: ['', [Validators.required]],
      ligneInterventions: this.fb.array([])
    });
  }

  /**
   * Retourne le FormArray des lignes d'intervention.
   */
  get ligneInterventions(): FormArray {
    return this.interventionForm.get('ligneInterventions') as FormArray;
  }

  /**
   * Retourne l'état actuel sélectionné.
   */
  get etatActuel(): string {
    return this.interventionForm.get('etatIntervention')?.value;
  }

  /**
   * Vérifie si le stock doit être décompté selon l'état.
   */
  get decompterStock(): boolean {
    const etat = this.etatActuel;
    return etat === EtatIntervention.EN_COURS ||
           etat === EtatIntervention.TERMINEE ||
           etat === 'En cours' ||
           etat === 'Terminée';
  }

  /**
   * Charge toutes les données nécessaires en parallèle avec forkJoin.
   * Garantit que produits et techniciens sont chargés avant l'intervention.
   */
  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    /* Charger techniciens et produits en parallèle */
    forkJoin({
      techniciens: this.utilisateurService.findAll(),
      produits: this.produitService.findAll()
    }).subscribe({
      next: (data) => {
        this.techniciens = data.techniciens;
        this.produits = data.produits;

        /* Charger le stock de chaque produit */
        data.produits.forEach(produit => {
          if (produit.id) {
            this.stockService.stockReelProduit(produit.id).subscribe({
              next: (stock) => {
                this.stockParProduit.set(produit.id!, stock);
              }
            });
          }
        });

        /* Charger l'intervention si mode modification */
        if (id) {
          this.interventionId = Number(id);
          this.isEditMode = true;
          this.loadIntervention(this.interventionId);
        } else {
          this.isLoading = false;
        }
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement des données.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Charge une intervention existante pour modification.
   * Vide les lignes existantes avant de les recharger.
   *
   * @param id L'identifiant de l'intervention
   */
  loadIntervention(id: number): void {
    this.interventionService.findById(id).subscribe({
      next: (intervention) => {
        const date = intervention.dateIntervention
          ? new Date(intervention.dateIntervention)
              .toISOString().split('T')[0]
          : '';

        /* Mapper l'état français vers l'enum */
        let etatMapped: any = intervention.etatIntervention;
        if (etatMapped === 'En attente') etatMapped = EtatIntervention.EN_ATTENTE;
        if (etatMapped === 'En cours') etatMapped = EtatIntervention.EN_COURS;
        if (etatMapped === 'Terminée') etatMapped = EtatIntervention.TERMINEE;
        if (etatMapped === 'Annulée') etatMapped = EtatIntervention.ANNULEE;

        /* Remplir le formulaire */
        this.interventionForm.patchValue({
          code: intervention.code,
          dateIntervention: date,
          etatIntervention: etatMapped,
          problematique: intervention.problematique,
          technicienId: intervention.technicien?.id
        });

        /* Vider les lignes existantes */
        while (this.ligneInterventions.length > 0) {
          this.ligneInterventions.removeAt(0);
        }

        /* Charger les lignes d'intervention existantes */
        if (intervention.ligneInterventions &&
            intervention.ligneInterventions.length > 0) {
          intervention.ligneInterventions.forEach(ligne => {
            this.ligneInterventions.push(
              this.createLigneForm(ligne.produit?.id, ligne.quantite)
            );
          });
        }

        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement de l intervention.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Crée un FormGroup pour une ligne d'intervention.
   *
   * @param produitId L'identifiant du produit
   * @param quantite La quantité utilisée
   */
  createLigneForm(produitId?: number, quantite?: number): FormGroup {
    return this.fb.group({
      produitId: [produitId || '', [Validators.required]],
      quantite: [quantite || 1, [Validators.required, Validators.min(1)]]
    });
  }

  /**
   * Ajoute une nouvelle ligne de produit.
   */
  ajouterLigne(): void {
    this.ligneInterventions.push(this.createLigneForm());
  }

  /**
   * Supprime une ligne de produit.
   *
   * @param index L'index de la ligne à supprimer
   */
  supprimerLigne(index: number): void {
    this.ligneInterventions.removeAt(index);
  }

  /**
   * Retourne le produit sélectionné pour une ligne.
   *
   * @param index L'index de la ligne
   */
  getProduitSelectionne(index: number): Produit | undefined {
    const produitId = this.ligneInterventions.at(index).get('produitId')?.value;
    return this.produits.find(p => p.id === Number(produitId));
  }

  /**
   * Retourne le stock réel d'un produit.
   *
   * @param produitId L'identifiant du produit
   * @returns Le stock réel ou 0 si non trouvé
   */
  getStockProduit(produitId: number): number {
    return this.stockParProduit.get(Number(produitId)) || 0;
  }

  /**
   * Vérifie si un produit est en rupture de stock.
   *
   * @param produitId L'identifiant du produit
   * @returns true si le stock est à 0 ou négatif
   */
  isRupture(produitId: number): boolean {
    return this.getStockProduit(Number(produitId)) <= 0;
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

    /* Construction des lignes d'intervention */
    const lignes: LigneIntervention[] = [];

    /* Ajouter les lignes uniquement si l'état décompte le stock */
    if (this.decompterStock && formValue.ligneInterventions.length > 0) {
      formValue.ligneInterventions.forEach((ligne: any) => {
        const produit = this.produits.find(
          p => p.id === Number(ligne.produitId)
        );
        if (produit) {
          lignes.push({
            produit: produit,
            quantite: ligne.quantite,
            idEntreprise: Number(localStorage.getItem('id_entreprise'))
          });
        }
      });
    }

    const intervention: Intervention = {
      code: formValue.code,
      dateIntervention: new Date(formValue.dateIntervention).toISOString(),
      etatIntervention: formValue.etatIntervention,
      problematique: formValue.problematique,
      technicien: technicienSelectionne,
      ligneInterventions: lignes,
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