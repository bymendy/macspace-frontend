import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProduitService } from '../../../core/services/produit.service';
import { CategorieService } from '../../../core/services/categorie.service';
import { FournisseurService } from '../../../core/services/fournisseur.service';
import { Produit } from '../../../shared/models/produit';
import { Categorie } from '../../../shared/models/categorie';
import { Fournisseur } from '../../../shared/models/fournisseur';

/**
 * Composant formulaire de création et modification d'un produit MacSpace.
 */
@Component({
  selector: 'app-produit-form',
  templateUrl: './produit-form.component.html',
  styleUrls: ['./produit-form.component.scss']
})
export class ProduitFormComponent implements OnInit {

  /** Formulaire produit */
  produitForm: FormGroup;

  /** Indicateur de chargement */
  isLoading = false;

  /** Indicateur de modification */
  isEditMode = false;

  /** Identifiant du produit en modification */
  produitId: number | null = null;

  /** Message d'erreur */
  errorMessage = '';

  /** Liste des catégories */
  categories: Categorie[] = [];

  /** Liste des fournisseurs */
  fournisseurs: Fournisseur[] = [];

  constructor(
    private fb: FormBuilder,
    private produitService: ProduitService,
    private categorieService: CategorieService,
    private fournisseurService: FournisseurService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    /* Initialisation du formulaire */
    this.produitForm = this.fb.group({
      codeProduit: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      prixUnitaireHt: ['', [Validators.required, Validators.min(0)]],
      tauxTva: ['', [Validators.required, Validators.min(0)]],
      prixUnitaireTtc: ['', [Validators.required, Validators.min(0)]],
      categoryId: ['', [Validators.required]],
      fournisseurId: ['', [Validators.required]]
    });
  }

  /**
   * Charge les catégories, fournisseurs et le produit si modification.
   */
  ngOnInit(): void {
    this.loadCategories();
    this.loadFournisseurs();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.produitId = Number(id);
      this.isEditMode = true;
      this.loadProduit(this.produitId);
    }
  }

  /**
   * Charge toutes les catégories.
   */
  loadCategories(): void {
    this.categorieService.findAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      }
    });
  }

  /**
   * Charge tous les fournisseurs.
   */
  loadFournisseurs(): void {
    this.fournisseurService.findAll().subscribe({
      next: (fournisseurs) => {
        this.fournisseurs = fournisseurs;
      }
    });
  }

  /**
   * Charge un produit existant pour modification.
   *
   * @param id L'identifiant du produit
   */
  loadProduit(id: number): void {
    this.isLoading = true;
    this.produitService.findById(id).subscribe({
      next: (produit) => {
        this.produitForm.patchValue({
          codeProduit: produit.codeProduit,
          designation: produit.designation,
          prixUnitaireHt: produit.prixUnitaireHt,
          tauxTva: produit.tauxTva,
          prixUnitaireTtc: produit.prixUnitaireTtc,
          categoryId: produit.category?.id,
          fournisseurId: produit.fournisseur?.id
        });
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Erreur lors du chargement du produit.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Calcule automatiquement le prix TTC.
   */
  calculerPrixTtc(): void {
    const ht = this.produitForm.get('prixUnitaireHt')?.value;
    const tva = this.produitForm.get('tauxTva')?.value;
    if (ht && tva) {
      const ttc = ht * (1 + tva / 100);
      this.produitForm.patchValue({
        prixUnitaireTtc: Math.round(ttc * 100) / 100
      });
    }
  }

  /**
   * Soumet le formulaire pour créer ou modifier un produit.
   */
  onSubmit(): void {
    if (this.produitForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.produitForm.value;

    /* Récupération de la catégorie et du fournisseur sélectionnés */
    const categorieSelectionnee = this.categories.find(
      c => c.id === Number(formValue.categoryId)
    );
    const fournisseurSelectionne = this.fournisseurs.find(
      f => f.id === Number(formValue.fournisseurId)
    );

    const produit: Produit = {
      codeProduit: formValue.codeProduit,
      designation: formValue.designation,
      prixUnitaireHt: formValue.prixUnitaireHt,
      tauxTva: formValue.tauxTva,
      prixUnitaireTtc: formValue.prixUnitaireTtc,
      category: categorieSelectionnee,
      fournisseur: fournisseurSelectionne,
      idEntreprise: Number(localStorage.getItem('id_entreprise'))
    };

    /* Ajout de l'id en mode modification */
    if (this.isEditMode && this.produitId) {
      produit.id = this.produitId;
    }

    this.produitService.save(produit).subscribe({
      next: () => {
        this.router.navigate(['/produits']);
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la sauvegarde du produit.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Annule et retourne à la liste des produits.
   */
  annuler(): void {
    this.router.navigate(['/produits']);
  }
}