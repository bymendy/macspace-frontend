import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../core/services/client.service';
import { InterventionService } from '../../../core/services/intervention.service';
import { ProduitService } from '../../../core/services/produit.service';
import { FournisseurService } from '../../../core/services/fournisseur.service';
import { Intervention } from '../../../shared/models/intervention';
import { forkJoin } from 'rxjs';

/**
 * Composant du tableau de bord principal de MacSpace.
 * Affiche les KPIs et statistiques en temps réel.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  /** Indicateur de chargement */
  isLoading = true;

  /** KPIs principaux */
  totalClients = 0;
  totalProduits = 0;
  totalFournisseurs = 0;
  totalInterventions = 0;

  /** Interventions en attente */
  interventionsEnAttente = 0;

  /** Interventions en cours */
  interventionsEnCours = 0;

  /** Interventions terminées */
  interventionsTerminees = 0;

  /** Dernières interventions */
  dernieresInterventions: Intervention[] = [];

  constructor(
    private clientService: ClientService,
    private interventionService: InterventionService,
    private produitService: ProduitService,
    private fournisseurService: FournisseurService
  ) {}

  /**
   * Initialise le dashboard en chargeant toutes les données.
   */
  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Charge toutes les données du dashboard en parallèle.
   */
  loadDashboardData(): void {
    this.isLoading = true;

    forkJoin({
      clients: this.clientService.findAll(),
      interventions: this.interventionService.findAll(),
      produits: this.produitService.findAll(),
      fournisseurs: this.fournisseurService.findAll()
    }).subscribe({
      next: (data) => {
        /* Calcul des KPIs */
        this.totalClients = data.clients.length;
        this.totalProduits = data.produits.length;
        this.totalFournisseurs = data.fournisseurs.length;
        this.totalInterventions = data.interventions.length;

        /* Calcul des interventions par état */
        this.interventionsEnAttente = data.interventions
          .filter(i => i.etatIntervention as any === 'En attente').length;
        this.interventionsEnCours = data.interventions
          .filter(i => i.etatIntervention as any === 'En cours').length;
        this.interventionsTerminees = data.interventions
          .filter(i => i.etatIntervention as any === 'Terminée').length;

        /* 5 dernières interventions */
        this.dernieresInterventions = data.interventions
          .slice(-5)
          .reverse();

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  /**
   * Retourne la classe CSS du badge selon l'état de l'intervention.
   *
   * @param etat L'état de l'intervention
   * @returns La classe CSS du badge
   */
  getBadgeClass(etat: string): string {
    switch (etat) {
      case 'En attente': return 'badge badge-warning';
      case 'En cours': return 'badge badge-info';
      case 'Terminée': return 'badge badge-success';
      case 'Annulée': return 'badge badge-danger';
      default: return 'badge';
    }
  }

  /**
   * Retourne le libellé français de l'état de l'intervention.
   *
   * @param etat L'état de l'intervention
   * @returns Le libellé français
   */
  getEtatLabel(etat: string): string {
    switch (etat) {
      case 'EN_ATTENTE': return 'En attente';
      case 'EN_COURS': return 'En cours';
      case 'TERMINEE': return 'Terminée';
      case 'ANNULEE': return 'Annulée';
      default: return etat;
    }
  }
}