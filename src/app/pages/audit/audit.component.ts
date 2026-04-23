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

  /** Liste complète des logs */
  auditLogs: AuditLog[] = [];

  /** Liste filtrée affichée */
  auditLogsFiltres: AuditLog[] = [];

  /** Filtre par entité */
  filtreEntite = 'tous';

  /** Filtre par action */
  filtreAction = 'tous';

  /** Indicateur de chargement */
  isLoading = false;

  /** Entités disponibles */
  entites = ['tous', 'client', 'intervention', 'produit', 'stock', 'fournisseur', 'categorie'];

  /** Actions disponibles */
  actions = ['tous', 'CREATE_UPDATE', 'READ', 'DELETE', 'ENTREE', 'SORTIE', 'CORRECTION_POS', 'CORRECTION_NEG'];

  constructor(private auditService: AuditService) {}

  ngOnInit(): void {
    this.chargerLogs();
  }

  /**
   * Charge tous les logs d'audit.
   */
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

  /**
   * Applique les filtres sur les logs.
   */
  appliquerFiltres(): void {
    this.auditLogsFiltres = this.auditLogs.filter(log => {
      const entiteOk = this.filtreEntite === 'tous' || log.entite === this.filtreEntite;
      const actionOk = this.filtreAction === 'tous' || log.action === this.filtreAction;
      return entiteOk && actionOk;
    });
  }

  /**
   * Retourne la classe CSS selon l'action.
   */
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

  /**
   * Formate la date pour l'affichage.
   */
  formatDate(date: string): string {
    return new Date(date).toLocaleString('fr-FR');
  }
}