import { Component, OnInit } from '@angular/core';
import { StockService } from '../../../core/services/stock.service';
import { ProduitService } from '../../../core/services/produit.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MvtStk, TypeMvtStk, SourceMvtStk } from '../../../shared/models/mvt-stk';
import { Produit } from '../../../shared/models/produit';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Composant de gestion des mouvements de stock MacSpace.
 * Affiche les mouvements et permet d'en créer de nouveaux.
 */
@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.scss']
})
export class StockListComponent implements OnInit {

  /** Liste des mouvements de stock */
  mouvements: MvtStk[] = [];

  /** Liste des produits */
  produits: Produit[] = [];

  /** Produit sélectionné */
  produitSelectionne: Produit | null = null;

  /** Stock réel du produit sélectionné */
  stockReel: number | null = null;

  /** Indicateur de chargement */
  isLoading = false;

  /** Afficher le formulaire de mouvement */
  showForm = false;

  /** Type de mouvement sélectionné */
  typeMouvement: TypeMvtStk = TypeMvtStk.ENTREE;

  /** Message d'erreur */
  errorMessage = '';

  /** Message de succès */
  successMessage = '';

  /** Formulaire de mouvement */
  mouvementForm: FormGroup;

  /** Types de mouvements disponibles */
  typesMouvement = [
    { value: TypeMvtStk.ENTREE, label: 'Entrée de stock' },
    { value: TypeMvtStk.SORTIE, label: 'Sortie de stock' },
    { value: TypeMvtStk.CORRECTION_POS, label: 'Correction positive' },
    { value: TypeMvtStk.CORRECTION_NEG, label: 'Correction négative' }
  ];

  constructor(
    private stockService: StockService,
    private produitService: ProduitService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) {
    /* Initialisation du formulaire */
    this.mouvementForm = this.fb.group({
      produitId: ['', [Validators.required]],
      typeMvt: [TypeMvtStk.ENTREE, [Validators.required]],
      quantite: ['', [Validators.required, Validators.min(1)]],
      sourceMvt: [SourceMvtStk.INTERVENTION]
    });
  }

  /**
   * Charge les produits au démarrage.
   */
  ngOnInit(): void {
    this.loadProduits();
  }

  /**
   * Charge tous les produits.
   */
  loadProduits(): void {
    this.produitService.findAll().subscribe({
      next: (produits) => {
        this.produits = produits;
      }
    });
  }

  /**
   * Charge les mouvements d'un produit sélectionné.
   */
  onProduitChange(event: Event): void {
    const idProduit = Number((event.target as HTMLSelectElement).value);
    if (!idProduit) return;

    this.produitSelectionne = this.produits.find(
      p => p.id === idProduit
    ) || null;

    this.isLoading = true;

    /* Charger le stock réel et les mouvements */
    this.stockService.stockReelProduit(idProduit).subscribe({
      next: (stock) => {
        this.stockReel = stock;
      }
    });

    this.stockService.findAllByProduit(idProduit).subscribe({
      next: (mouvements) => {
        this.mouvements = mouvements.reverse();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  /**
   * Soumet le formulaire de mouvement de stock.
   */
  onSubmit(): void {
    if (this.mouvementForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.mouvementForm.value;
    const produit = this.produits.find(
      p => p.id === Number(formValue.produitId)
    );

    const mvtStk: MvtStk = {
      quantite: formValue.quantite,
      typeMvt: formValue.typeMvt,
      sourceMvt: formValue.sourceMvt,
      dateMvt: new Date().toISOString(),
      produit: produit,
      idEntreprise: Number(localStorage.getItem('id_entreprise'))
    };

    /* Appel du service selon le type de mouvement */
    let operation;
    switch (formValue.typeMvt) {
      case TypeMvtStk.ENTREE:
        operation = this.stockService.entreeStock(mvtStk);
        break;
      case TypeMvtStk.SORTIE:
        operation = this.stockService.sortieStock(mvtStk);
        break;
      case TypeMvtStk.CORRECTION_POS:
        operation = this.stockService.correctionPos(mvtStk);
        break;
      case TypeMvtStk.CORRECTION_NEG:
        operation = this.stockService.correctionNeg(mvtStk);
        break;
      default:
        operation = this.stockService.entreeStock(mvtStk);
    }

    operation.subscribe({
      next: () => {
        this.notificationService.success('Mouvement de stock enregistré avec succès.');
        this.showForm = false;
        this.mouvementForm.reset({
          typeMvt: TypeMvtStk.ENTREE,
          sourceMvt: SourceMvtStk.INTERVENTION
        });

        /* Recharger les données du produit */
        if (produit?.id) {
          this.onProduitChange({
            target: { value: produit.id }
          } as any);
        }
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.error('Erreur lors de l enregistrement du mouvement.');
        this.isLoading = false;
      }
    });
  }

  /**
   * Retourne la classe CSS du badge selon le type de mouvement.
   */
  getBadgeClass(typeMvt: string): string {
    switch (typeMvt) {
      case 'ENTREE': return 'badge badge-success';
      case 'SORTIE': return 'badge badge-danger';
      case 'CORRECTION_POS': return 'badge badge-info';
      case 'CORRECTION_NEG': return 'badge badge-warning';
      default: return 'badge';
    }
  }

  /**
   * Retourne le libellé du type de mouvement.
   */
  getTypeMvtLabel(typeMvt: string): string {
    switch (typeMvt) {
      case 'ENTREE': return 'Entrée';
      case 'SORTIE': return 'Sortie';
      case 'CORRECTION_POS': return 'Correction +';
      case 'CORRECTION_NEG': return 'Correction -';
      default: return typeMvt;
    }
  }

  /**
   * Formate la date du mouvement.
   */
  formatDate(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  }
}