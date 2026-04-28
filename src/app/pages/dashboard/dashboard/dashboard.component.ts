import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../core/services/client.service';
import { InterventionService } from '../../../core/services/intervention.service';
import { ProduitService } from '../../../core/services/produit.service';
import { FournisseurService } from '../../../core/services/fournisseur.service';
import { StockService } from '../../../core/services/stock.service';
import { AuditService } from '../../../core/services/audit.service';
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

  isLoading = true;

  /** KPIs principaux */
  totalClients = 0;
  totalProduits = 0;
  totalFournisseurs = 0;
  totalInterventions = 0;

  /** KPIs avancés — Data Manager */
  totalAuditLogs = 0;
  totalStockCritique = 0;
  tauxResolution = 0;

  /** Interventions par état */
  interventionsEnAttente = 0;
  interventionsEnCours = 0;
  interventionsTerminees = 0;
  interventionsAnnulees = 0;

  /** Dernières interventions */
  dernieresInterventions: Intervention[] = [];

  /** Graphique interventions par état (Doughnut) */
  interventionsChartData: ChartData<'doughnut'> = {
    labels: ['En attente', 'En cours', 'Terminées', 'Annulées'],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ['#ff9800', '#2196f3', '#4caf50', '#f44336'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 20, font: { size: 13 } }
      }
    }
  };

  /** Graphique stock par produit (Bar) */
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

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f0f0f0' }, ticks: { stepSize: 1 } },
      x: { grid: { display: false } }
    }
  };

  /** Graphique interventions par technicien (Bar horizontal) */
  technicienChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      label: 'Interventions',
      data: [],
      backgroundColor: '#2196f3',
      borderRadius: 6,
      hoverBackgroundColor: '#1565c0'
    }]
  };

  technicienChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, ticks: { stepSize: 1 } },
      y: { grid: { display: false } }
    }
  };

  constructor(
    private clientService: ClientService,
    private interventionService: InterventionService,
    private produitService: ProduitService,
    private fournisseurService: FournisseurService,
    private stockService: StockService,
    private auditService: AuditService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    forkJoin({
      clients: this.clientService.findAll(),
      interventions: this.interventionService.findAll(),
      produits: this.produitService.findAll(),
      fournisseurs: this.fournisseurService.findAll(),
      auditLogs: this.auditService.findAll()
    }).subscribe({
      next: (data) => {
        /* KPIs principaux */
        this.totalClients = data.clients.length;
        this.totalProduits = data.produits.length;
        this.totalFournisseurs = data.fournisseurs.length;
        this.totalInterventions = data.interventions.length;

        /* KPI Audit Trail */
        this.totalAuditLogs = data.auditLogs.length;

        /* Interventions par état */
        this.interventionsEnAttente = data.interventions
          .filter(i => i.etatIntervention as any === 'En attente').length;
        this.interventionsEnCours = data.interventions
          .filter(i => i.etatIntervention as any === 'En cours').length;
        this.interventionsTerminees = data.interventions
          .filter(i => i.etatIntervention as any === 'Terminée').length;
        this.interventionsAnnulees = data.interventions
          .filter(i => i.etatIntervention as any === 'Annulée').length;

        /* Taux de résolution */
        this.tauxResolution = this.totalInterventions > 0
          ? Math.round((this.interventionsTerminees / this.totalInterventions) * 100)
          : 0;

        /* Graphique doughnut */
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

        /* Graphique interventions par technicien */
        this.calculerInterventionsParTechnicien(data.interventions);

        /* 5 dernières interventions */
        this.dernieresInterventions = data.interventions.slice(-5).reverse();

        /* Stock produits */
        this.loadStockProduits(data.produits);

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  /**
   * Calcule le nombre d'interventions par technicien.
   */
  calculerInterventionsParTechnicien(interventions: Intervention[]): void {
    const map = new Map<string, number>();

    interventions.forEach(i => {
      const nom = i.technicien
        ? `${i.technicien.prenom} ${i.technicien.nom}`
        : 'Non assigné';
      map.set(nom, (map.get(nom) || 0) + 1);
    });

    const sorted = Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    this.technicienChartData = {
      labels: sorted.map(e => e[0]),
      datasets: [{
        label: 'Interventions',
        data: sorted.map(e => e[1]),
        backgroundColor: '#2196f3',
        borderRadius: 6,
        hoverBackgroundColor: '#1565c0'
      }]
    };
  }

  loadStockProduits(produits: any[]): void {
    const labels: string[] = [];
    const stocks: number[] = [];
    let loaded = 0;
    let stockCritique = 0;

    produits.forEach(produit => {
      if (produit.id) {
        this.stockService.stockReelProduit(produit.id).subscribe({
          next: (stock) => {
            labels.push(produit.codeProduit);
            stocks.push(stock);
            if (stock <= 5) stockCritique++;
            loaded++;

            if (loaded === produits.length) {
              this.totalStockCritique = stockCritique;
              this.stockChartData = {
                labels,
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

  getBadgeClass(etat: string): string {
    switch (etat) {
      case 'En attente': return 'badge badge-warning';
      case 'En cours': return 'badge badge-info';
      case 'Terminée': return 'badge badge-success';
      case 'Annulée': return 'badge badge-danger';
      default: return 'badge';
    }
  }

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