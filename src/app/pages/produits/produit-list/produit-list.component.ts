import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProduitService } from '../../../core/services/produit.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Produit } from '../../../shared/models/produit';

/**
 * Composant de la liste des produits MacSpace.
 * Affiche tous les produits avec options de recherche et actions.
 * Pagination : 15 lignes par page
 */
@Component({
  selector: 'app-produit-list',
  templateUrl: './produit-list.component.html',
  styleUrls: ['./produit-list.component.scss']
})
export class ProduitListComponent implements OnInit {

  /** Liste complète des produits */
  produits: Produit[] = [];

  /** Liste filtrée des produits */
  produitsFiltres: Produit[] = [];

  /** Indicateur de chargement */
  isLoading = true;

  /** ===== PAGINATION ===== */
  /** Page courante */
  pageCourante = 1;

  /** Nombre de lignes par page */
  lignesParPage = 15;

  constructor(
    private produitService: ProduitService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  /**
   * Charge la liste des produits au démarrage.
   */
  ngOnInit(): void {
    this.loadProduits();
  }

  /**
   * Charge tous les produits depuis l'API.
   */
  loadProduits(): void {
    this.isLoading = true;
    this.produitService.findAll().subscribe({
      next: (produits) => {
        this.produits = produits;
        this.produitsFiltres = produits;
        this.pageCourante = 1;
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement des produits.');
        this.isLoading = false;
      }
    });
  }

  /**
   * Filtre les produits selon le terme de recherche.
   * Remet la pagination à la page 1.
   */
  onRecherche(event: Event): void {
    const terme = (event.target as HTMLInputElement).value.toLowerCase();
    this.produitsFiltres = this.produits.filter(produit =>
      produit.codeProduit.toLowerCase().includes(terme) ||
      produit.designation.toLowerCase().includes(terme) ||
      (produit.category?.designation.toLowerCase().includes(terme))
    );
    this.pageCourante = 1;
  }

  // ===== PAGINATION =====

  /**
   * Retourne les produits de la page courante.
   */
  get produitsPage(): Produit[] {
    const debut = (this.pageCourante - 1) * this.lignesParPage;
    const fin = debut + this.lignesParPage;
    return this.produitsFiltres.slice(debut, fin);
  }

  /**
   * Retourne le nombre total de pages.
   */
  get totalPages(): number {
    return Math.ceil(this.produitsFiltres.length / this.lignesParPage);
  }

  /**
   * Retourne la liste des numéros de pages.
   */
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  /**
   * Navigue vers une page spécifique.
   */
  allerPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageCourante = page;
    }
  }

  /**
   * Retourne l'index de début de la page courante.
   */
  get debutPage(): number {
    return (this.pageCourante - 1) * this.lignesParPage + 1;
  }

  /**
   * Retourne l'index de fin de la page courante.
   */
  get finPage(): number {
    return Math.min(
      this.pageCourante * this.lignesParPage,
      this.produitsFiltres.length
    );
  }

  // ===== ACTIONS =====

  /**
   * Navigue vers le formulaire de création d'un produit.
   */
  nouveauProduit(): void {
    this.router.navigate(['/produits/nouveau']);
  }

  /**
   * Navigue vers le formulaire de modification d'un produit.
   */
  modifierProduit(id: number): void {
    this.router.navigate(['/produits/modifier', id]);
  }

  /**
   * Supprime un produit après confirmation.
   */
  supprimerProduit(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
      this.produitService.delete(id).subscribe({
        next: () => {
          this.notificationService.success('Produit supprimé avec succès.');
          this.loadProduits();
        },
        error: () => {
          this.notificationService.error('Impossible de supprimer ce produit.');
        }
      });
    }
  }
}