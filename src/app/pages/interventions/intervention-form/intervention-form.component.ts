import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { InterventionService } from '../../../core/services/intervention.service';
import { UtilisateurService } from '../../../core/services/utilisateur.service';
import { ProduitService } from '../../../core/services/produit.service';
import { StockService } from '../../../core/services/stock.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Intervention, EtatIntervention, LigneIntervention } from '../../../shared/models/intervention';
import { Utilisateur } from '../../../shared/models/utilisateur';
import { Produit } from '../../../shared/models/produit';

/**
 * Composant formulaire de création et modification d'une intervention MacSpace.
 * Gère les lignes de produits utilisés avec décompte du stock.
 * Le décompte du stock est géré côté backend selon l'état de l'intervention.
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

  /** Terme de recherche par ligne */
  rechercheProduit: string[] = [];

  /** Liste filtrée de produits par ligne */
  produitsFiltres: Produit[][] = [];

  /** Contrôle l'ouverture de la dropdown par ligne */
  dropdownOuvert: boolean[] = [];

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
    private notificationService: NotificationService,
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
   * Utilisé pour l'affichage du message informatif dans le HTML.
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
   */
  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];

    forkJoin({
      techniciens: this.utilisateurService.findAll(),
      produits: this.produitService.findAll()
    }).subscribe({
      next: (data) => {
        this.techniciens = data.techniciens;
        this.produits = data.produits;

        /* Initialiser les tableaux de recherche */
        this.produitsFiltres = [];
        this.rechercheProduit = [];

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
          this.dropdownOuvert.push(false);

        }
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement des données.');
        this.isLoading = false;
      }
    });
  }

  /**
   * Charge une intervention existante pour modification.
   */
  loadIntervention(id: number): void {
    this.interventionService.findById(id).subscribe({
      next: (intervention) => {
        const date = intervention.dateIntervention
          ? new Date(intervention.dateIntervention).toISOString().split('T')[0]
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

            /* Ajouter la ligne au formulaire */
            this.ligneInterventions.push(
              this.createLigneForm(ligne.produit?.id, ligne.quantite)
            );

            /* Initialiser la recherche avec le produit existant */
            const produit = this.produits.find(p => p.id === ligne.produit?.id);
            this.rechercheProduit.push(
              produit ? `${produit.codeProduit} - ${produit.designation}` : ''
            );
            this.produitsFiltres.push([...this.produits]);
          });
        }

        this.isLoading = false;
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement de l intervention.');
        this.isLoading = false;
      }
    });
  }

  /**
   * Crée un FormGroup pour une ligne d'intervention.
   */
  createLigneForm(produitId?: number, quantite?: number): FormGroup {
    return this.fb.group({
      produitId: [produitId || '', [Validators.required]],
      quantite: [quantite || 1, [Validators.required, Validators.min(1)]]
    });
  }

  /**
   * Ajoute une nouvelle ligne de produit avec sa recherche.
   */
  ajouterLigne(): void {
      this.ligneInterventions.push(this.createLigneForm());
    this.rechercheProduit.push('');
    this.produitsFiltres.push([...this.produits]);
    this.dropdownOuvert.push(false); // ← ajouter un contrôle d'ouverture pour la nouvelle ligne
  }

  /**
   * Supprime une ligne et sa recherche associée.
   */
  supprimerLigne(index: number): void {
    this.ligneInterventions.removeAt(index);
    this.rechercheProduit.splice(index, 1);
    this.produitsFiltres.splice(index, 1);
    this.dropdownOuvert.splice(index, 1); // ← ajouter

  }

  /**
   * Filtre les produits selon le terme de recherche.
   */
  onRechercheProduit(terme: string, index: number): void {
    this.rechercheProduit[index] = terme;
    this.ligneInterventions.at(index).get('produitId')?.setValue('');
    const termeLower = terme.toLowerCase();
    this.produitsFiltres[index] = this.produits.filter(p =>
      p.codeProduit?.toLowerCase().includes(termeLower) ||
      p.designation?.toLowerCase().includes(termeLower)
    );
    /* Ouvrir la dropdown si on tape quelque chose */
    this.dropdownOuvert[index] = terme.length > 0;
  }

  /**
   * Sélectionne un produit dans la liste filtrée.
   */
  selectionnerProduit(produit: Produit, index: number): void {
    this.ligneInterventions.at(index).get('produitId')?.setValue(produit.id);
    this.rechercheProduit[index] =
      `${produit.codeProduit} - ${produit.designation}`;
    this.produitsFiltres[index] = [];
    this.dropdownOuvert[index] = false; // ← ferme la dropdown
  }

  /**
   * Retourne le produit sélectionné pour une ligne.
   */
  getProduitSelectionne(index: number): Produit | undefined {
    const produitId = this.ligneInterventions.at(index).get('produitId')?.value;
    return this.produits.find(p => p.id === Number(produitId));
  }

  /**
   * Retourne le stock réel d'un produit.
   */
  getStockProduit(produitId: number): number {
    return this.stockParProduit.get(Number(produitId)) || 0;
  }

  /**
   * Vérifie si un produit est en rupture de stock.
   */
  isRupture(produitId: number): boolean {
    return this.getStockProduit(Number(produitId)) <= 0;
  }

  /**
   * Soumet le formulaire.
   * Les lignes sont toujours envoyées — le backend gère le stock.
   */
  onSubmit(): void {
    if (this.interventionForm.invalid) return;

    this.isLoading = true;
    const formValue = this.interventionForm.value;

    const technicienSelectionne = this.techniciens.find(
      t => t.id === Number(formValue.technicienId)
    );

    /* Construction des lignes */
    const lignes: LigneIntervention[] = [];
    if (formValue.ligneInterventions.length > 0) {
      formValue.ligneInterventions.forEach((ligne: any) => {
        const produit = this.produits.find(p => p.id === Number(ligne.produitId));
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

    if (this.isEditMode && this.interventionId) {
      intervention.id = this.interventionId;
    }

    this.interventionService.save(intervention).subscribe({
      next: () => {
        this.notificationService.success(
          this.isEditMode ?
            'Intervention modifiée avec succès.' :
            'Intervention créée avec succès.'
        );
        this.router.navigate(['/interventions']);
      },
      error: () => {
        this.notificationService.error('Erreur lors de la sauvegarde de l intervention.');
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