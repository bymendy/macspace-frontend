import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProduitService } from '../../../core/services/produit.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Produit } from '../../../shared/models/produit';

/**
 * Composant de la liste des produits MacSpace.
 * Affiche tous les produits avec options de recherche et actions.
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
   *
   * @param event L'événement de saisie
   */
  onRecherche(event: Event): void {
    const terme = (event.target as HTMLInputElement).value.toLowerCase();
    this.produitsFiltres = this.produits.filter(produit =>
      produit.codeProduit.toLowerCase().includes(terme) ||
      produit.designation.toLowerCase().includes(terme) ||
      (produit.category?.designation.toLowerCase().includes(terme))
    );
  }
  /**
   * Navigue vers le formulaire de création d'un produit.
   */
  nouveauProduit(): void {
    this.router.navigate(['/produits/nouveau']);
  }
  /**
   * Navigue vers le formulaire de modification d'un produit.
   *
   * @param id L'identifiant du produit
   */
  modifierProduit(id: number): void {
    this.router.navigate(['/produits/modifier', id]);
  }
  /**
   * Supprime un produit après confirmation.
   *
   * @param id L'identifiant du produit
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