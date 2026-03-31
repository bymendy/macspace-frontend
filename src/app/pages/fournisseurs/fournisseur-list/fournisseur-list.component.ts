import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FournisseurService } from '../../../core/services/fournisseur.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Fournisseur } from '../../../shared/models/fournisseur';

/**
 * Composant de la liste des fournisseurs MacSpace.
 * Pagination : 15 lignes par page
 */
@Component({
  selector: 'app-fournisseur-list',
  templateUrl: './fournisseur-list.component.html',
  styleUrls: ['./fournisseur-list.component.scss']
})
export class FournisseurListComponent implements OnInit {

  /** Liste complète des fournisseurs */
  fournisseurs: Fournisseur[] = [];

  /** Liste filtrée des fournisseurs */
  fournisseursFiltres: Fournisseur[] = [];

  /** Indicateur de chargement */
  isLoading = true;

  /** ===== PAGINATION ===== */
  pageCourante = 1;
  lignesParPage = 15;

  constructor(
    private fournisseurService: FournisseurService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFournisseurs();
  }

  loadFournisseurs(): void {
    this.isLoading = true;
    this.fournisseurService.findAll().subscribe({
      next: (fournisseurs) => {
        this.fournisseurs = fournisseurs;
        this.fournisseursFiltres = fournisseurs;
        this.pageCourante = 1;
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.error('Erreur lors du chargement des fournisseurs.');
        this.isLoading = false;
      }
    });
  }

  onRecherche(event: Event): void {
    const terme = (event.target as HTMLInputElement).value.toLowerCase();
    this.fournisseursFiltres = this.fournisseurs.filter(f =>
      f.nom.toLowerCase().includes(terme) ||
      f.email.toLowerCase().includes(terme) ||
      (f.numTel && f.numTel.includes(terme))
    );
    this.pageCourante = 1;
  }

  // ===== PAGINATION =====

  get fournisseursPage(): Fournisseur[] {
    const debut = (this.pageCourante - 1) * this.lignesParPage;
    return this.fournisseursFiltres.slice(debut, debut + this.lignesParPage);
  }

  get totalPages(): number {
    return Math.ceil(this.fournisseursFiltres.length / this.lignesParPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  allerPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageCourante = page;
    }
  }

  get debutPage(): number {
    return (this.pageCourante - 1) * this.lignesParPage + 1;
  }

  get finPage(): number {
    return Math.min(this.pageCourante * this.lignesParPage, this.fournisseursFiltres.length);
  }

  // ===== ACTIONS =====

  nouveauFournisseur(): void {
    this.router.navigate(['/fournisseurs/nouveau']);
  }

  modifierFournisseur(id: number): void {
    this.router.navigate(['/fournisseurs/modifier', id]);
  }

  supprimerFournisseur(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce fournisseur ?')) {
      this.fournisseurService.delete(id).subscribe({
        next: () => {
          this.notificationService.success('Fournisseur supprimé avec succès.');
          this.loadFournisseurs();
        },
        error: () => {
          this.notificationService.error('Impossible de supprimer ce fournisseur.');
        }
      });
    }
  }
}