import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';
import {
  DatawarehouseService,
  TableauBordGlobal,
  PerformanceTechnicien,
  ProduitPlusUtilise,
  InterventionParMois
} from '../../../core/services/datawarehouse.service';

/**
 * Composant Data Warehouse MacSpace.
 * Page analytique réservée aux administrateurs.
 * Affiche les KPIs, graphiques et tableaux issus du DW MySQL.
 */
@Component({
  selector: 'app-datawarehouse',
  templateUrl: './datawarehouse.component.html',
  styleUrls: ['./datawarehouse.component.scss']
})
export class DatawarehouseComponent implements OnInit {

  isLoading = true;
  hasError = false;

  /** KPIs globaux */
  kpis: TableauBordGlobal = {
    totalInterventions: 0,
    nbTechniciensActifs: 0,
    tauxResolutionGlobal: 0,
    totalProduitsUtilises: 0,
    totalMouvementsStock: 0
  };

  /** Données tableaux */
  techniciens: PerformanceTechnicien[] = [];
  produits: ProduitPlusUtilise[] = [];
  interventionsParMois: InterventionParMois[] = [];

  /** Graphique performance techniciens (Bar horizontal) */
  technicienChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      label: 'Interventions',
      data: [],
      backgroundColor: '#2196f3',
      borderRadius: 6
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

  /** Graphique produits plus utilisés (Bar) */
  produitsChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      label: 'Mouvements',
      data: [],
      backgroundColor: '#E46C0C',
      borderRadius: 6
    }]
  };

  produitsChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 5 } },
      x: { grid: { display: false } }
    }
  };

  /** Graphique évolution mensuelle (Line) */
  evolutionChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      label: 'Interventions',
      data: [],
      borderColor: '#4caf50',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#4caf50',
      pointRadius: 5
    }]
  };

  evolutionChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: '#f0f0f0' } },
      x: { grid: { display: false } }
    }
  };

  constructor(private dwService: DatawarehouseService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.hasError = false;

    forkJoin({
      kpis: this.dwService.getTableauBordGlobal(),
      techniciens: this.dwService.getPerformanceTechniciens(),
      produits: this.dwService.getProduitsLesPlusUtilises(),
      interventions: this.dwService.getInterventionsParMois()
    }).subscribe({
      next: (data) => {
        /* KPIs */
        this.kpis = data.kpis;

        /* Techniciens */
        this.techniciens = data.techniciens;
        this.technicienChartData = {
          labels: data.techniciens.map(t => `${t.prenom} ${t.nom}`),
          datasets: [{
            label: 'Interventions',
            data: data.techniciens.map(t => t.nbInterventions),
            backgroundColor: '#2196f3',
            borderRadius: 6
          }]
        };

        /* Produits */
        this.produits = data.produits;
        this.produitsChartData = {
          labels: data.produits.map(p => p.codeProduit),
          datasets: [{
            label: 'Mouvements',
            data: data.produits.map(p => p.nbMouvements),
            backgroundColor: '#E46C0C',
            borderRadius: 6
          }]
        };

        /* Évolution mensuelle */
        this.interventionsParMois = data.interventions;
        this.evolutionChartData = {
          labels: data.interventions.map(i => `${i.nomMois} ${i.annee}`),
          datasets: [{
            label: 'Interventions',
            data: data.interventions.map(i => i.nbInterventions),
            borderColor: '#4caf50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#4caf50',
            pointRadius: 5
          }]
        };

        this.isLoading = false;
      },
      error: (err) => {
        console.error('DW Error:', err);
        this.isLoading = false;
      }
    });
  }
}