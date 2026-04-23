import { Component, OnInit } from '@angular/core';
import { AuditLog, AuditService } from '../../core/services/audit.service';

/**
 * Composant du tableau de bord des logs d'audit MacSpace.
 */
@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {

  auditLogs: AuditLog[] = [];
  auditLogsFiltres: AuditLog[] = [];
  auditLogsPage: AuditLog[] = [];

  filtreEntite = 'tous';
  filtreAction = 'tous';
  isLoading = false;

  /** Pagination */
  pageActuelle = 1;
  elementsParPage = 15;
  totalPages = 0;

  entites = ['tous', 'client', 'intervention', 'produit', 'stock', 'fournisseur', 'categorie'];
  actions = ['tous', 'CREATE_UPDATE', 'READ', 'DELETE', 'ENTREE', 'SORTIE', 'CORRECTION_POS', 'CORRECTION_NEG'];

  constructor(private auditService: AuditService) {}

  ngOnInit(): void {
    this.chargerLogs();
  }

  chargerLogs(): void {
    this.isLoading = true;
    this.auditService.findAll().subscribe({
      next: (logs) => {
        this.auditLogs = logs;
        this.appliquerFiltres();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement audit logs', err);
        this.isLoading = false;
      }
    });
  }

  appliquerFiltres(): void {
    this.auditLogsFiltres = this.auditLogs.filter(log => {
      const entiteOk = this.filtreEntite === 'tous' || log.entite === this.filtreEntite;
      const actionOk = this.filtreAction === 'tous' || log.action === this.filtreAction;
      return entiteOk && actionOk;
    });
    this.pageActuelle = 1;
    this.calculerPagination();
  }

  calculerPagination(): void {
    this.totalPages = Math.ceil(this.auditLogsFiltres.length / this.elementsParPage);
    this.mettreAJourPage();
  }

  mettreAJourPage(): void {
    const debut = (this.pageActuelle - 1) * this.elementsParPage;
    const fin = debut + this.elementsParPage;
    this.auditLogsPage = this.auditLogsFiltres.slice(debut, fin);
  }

  pagePrecedente(): void {
    if (this.pageActuelle > 1) {
      this.pageActuelle--;
      this.mettreAJourPage();
    }
  }

  pageSuivante(): void {
    if (this.pageActuelle < this.totalPages) {
      this.pageActuelle++;
      this.mettreAJourPage();
    }
  }

  allerPage(page: number): void {
    this.pageActuelle = page;
    this.mettreAJourPage();
  }

  getPages(): number[] {
    const pages: number[] = [];
    const debut = Math.max(1, this.pageActuelle - 2);
    const fin = Math.min(this.totalPages, this.pageActuelle + 2);
    for (let i = debut; i <= fin; i++) {
      pages.push(i);
    }
    return pages;
  }

  getActionClass(action: string): string {
    switch (action) {
      case 'CREATE_UPDATE': return 'badge-success';
      case 'DELETE':        return 'badge-danger';
      case 'READ':          return 'badge-info';
      case 'ENTREE':        return 'badge-success';
      case 'SORTIE':        return 'badge-warning';
      default:              return 'badge-primary';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('fr-FR');
  }
}