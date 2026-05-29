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

@Component({
  selector: 'app-datawarehouse',
  templateUrl: './datawarehouse.component.html',
  styleUrls: ['./datawarehouse.component.scss']
})
export class DatawarehouseComponent implements OnInit {

  isLoading = true;
  hasError = false;
  isRefreshing = false;

  kpis: TableauBordGlobal = {
    totalInterventions: 0,
    nbTechniciensActifs: 0,
    tauxResolutionGlobal: 0,
    totalProduitsUtilises: 0,
    totalMouvementsStock: 0
  };

  techniciens: PerformanceTechnicien[] = [];
  produits: ProduitPlusUtilise[] = [];
  interventionsParMois: InterventionParMois[] = [];

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

  onActualiser(): void {
    console.log('>>> onActualiser() déclenché');
    this.isRefreshing = true;
    this.hasError = false;

    this.dwService.initETL().subscribe({
      next: (message) => {
        console.log('>>> ETL OK :', message);
        this.loadData();
        this.isRefreshing = false;
      },
      error: (err) => {
        console.error('>>> Erreur ETL :', err);
        this.hasError = true;
        this.isRefreshing = false;
      }
    });
  }

  loadData(): void {
    console.log('>>> loadData() déclenché');
    this.isLoading = true;
    this.hasError = false;

    forkJoin({
      kpis: this.dwService.getTableauBordGlobal(),
      techniciens: this.dwService.getPerformanceTechniciens(),
      produits: this.dwService.getProduitsLesPlusUtilises(),
      interventions: this.dwService.getInterventionsParMois()
    }).subscribe({
      next: (data) => {
        console.log('>>> forkJoin OK — données reçues :', data);

        this.kpis = data.kpis;

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
        console.log('>>> isLoading = false — affichage mis à jour');
      },
      error: (err) => {
        console.error('>>> forkJoin Error :', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }
}