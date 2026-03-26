import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../core/services/client.service';
import { InterventionService } from '../../../core/services/intervention.service';
import { ProduitService } from '../../../core/services/produit.service';
import { FournisseurService } from '../../../core/services/fournisseur.service';
import { StockService } from '../../../core/services/stock.service';
import { Intervention } from '../../../shared/models/intervention';
import { forkJoin } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';

/**
 * Composant du tableau de bord principal de MacSpace.
 * Affiche les KPIs, statistiques et graphiques en temps réel.
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

  /** Interventions annulées */
  interventionsAnnulees = 0;

  /** Dernières interventions */
  dernieresInterventions: Intervention[] = [];

  /** Données graphique interventions par état (Doughnut) */
  interventionsChartData: ChartData<'doughnut'> = {
    labels: ['En attente', 'En cours', 'Terminées', 'Annulées'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: [
        '#ff9800',
        '#2196f3',
        '#4caf50',
        '#f44336'
      ],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  /** Options graphique doughnut */
  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: { size: 13 }
        }
      }
    }
  };

  /** Données graphique stock par produit (Bar) */
  stockChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      label: 'Stock disponible',
      data: [],
      backgroundColor: '#E46C0C',
      borderRadius: 6,
      hoverBackgroundColor: '#c45a00'
    }]
  };

  /** Options graphique bar */
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f0f0f0'
        },
        ticks: {
          stepSize: 1
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  constructor(
    private clientService: ClientService,
    private interventionService: InterventionService,
    private produitService: ProduitService,
    private fournisseurService: FournisseurService,
    private stockService: StockService
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
        this.interventionsAnnulees = data.interventions
          .filter(i => i.etatIntervention as any === 'Annulée').length;

        /* Mise à jour graphique doughnut */
        this.interventionsChartData = {
          ...this.interventionsChartData,
          datasets: [{
            ...this.interventionsChartData.datasets[0],
            data: [
              this.interventionsEnAttente,
              this.interventionsEnCours,
              this.interventionsTerminees,
              this.interventionsAnnulees
            ]
          }]
        };

        /* 5 dernières interventions */
        this.dernieresInterventions = data.interventions
          .slice(-5)
          .reverse();

        /* Charger le stock des produits pour le graphique */
        this.loadStockProduits(data.produits);

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  /**
   * Charge le stock réel de chaque produit pour le graphique bar.
   *
   * @param produits La liste des produits
   */
  loadStockProduits(produits: any[]): void {
    const labels: string[] = [];
    const stocks: number[] = [];
    let loaded = 0;

    produits.forEach(produit => {
      if (produit.id) {
        this.stockService.stockReelProduit(produit.id).subscribe({
          next: (stock) => {
            labels.push(produit.codeProduit);
            stocks.push(stock);
            loaded++;

            /* Mettre à jour le graphique quand tous les stocks sont chargés */
            if (loaded === produits.length) {
              this.stockChartData = {
                labels: labels,
                datasets: [{
                  label: 'Stock disponible',
                  data: stocks,
                  backgroundColor: stocks.map(s =>
                    s <= 0 ? '#f44336' : s <= 5 ? '#ff9800' : '#E46C0C'
                  ),
                  borderRadius: 6,
                  hoverBackgroundColor: '#c45a00'
                }]
              };
            }
          }
        });
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