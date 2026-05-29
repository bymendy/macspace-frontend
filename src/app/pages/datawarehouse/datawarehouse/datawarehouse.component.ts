import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';
import jsPDF from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';
applyPlugin(jsPDF);
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
  isExporting = false;

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

        this.kpis = { ...data.kpis };

        this.techniciens = [...data.techniciens];
        this.technicienChartData = {
          labels: data.techniciens.map(t => `${t.prenom} ${t.nom}`),
          datasets: [{
            label: 'Interventions',
            data: data.techniciens.map(t => t.nbInterventions),
            backgroundColor: '#2196f3',
            borderRadius: 6
          }]
        };

        this.produits = [...data.produits];
        this.produitsChartData = {
          labels: data.produits.map(p => p.codeProduit),
          datasets: [{
            label: 'Mouvements',
            data: data.produits.map(p => p.nbMouvements),
            backgroundColor: '#E46C0C',
            borderRadius: 6
          }]
        };

        this.interventionsParMois = [...data.interventions];
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
        console.log('>>> techniciens après update :', this.techniciens);
      },
      error: (err) => {
        console.error('>>> forkJoin Error :', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }

  // ================================================================
  // EXPORT PDF DATA WAREHOUSE
  // ================================================================
  exportPdf(): void {
    this.isExporting = true;

    const doc = new jsPDF('p', 'mm', 'a4');
    const orange: [number, number, number] = [232, 89, 60];
    const noir: [number, number, number]   = [26, 26, 26];
    const gris: [number, number, number]   = [136, 136, 136];
    const grisClair: [number, number, number] = [245, 245, 245];

    const dateRapport = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    let y = 15;

    // ── EN-TÊTE ──────────────────────────────────────────────────
    doc.setFillColor(...orange);
    doc.rect(0, 0, 210, 22, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('MacSpace — Data Warehouse', 14, 10);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Rapport analytique avancé · Mac Sécurité', 14, 17);
    doc.text(`Généré le ${dateRapport}`, 196, 17, { align: 'right' });

    y = 30;

    // ── KPIs ─────────────────────────────────────────────────────
    doc.setTextColor(...noir);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('KPIs globaux', 14, y);
    doc.setDrawColor(...orange);
    doc.setLineWidth(0.5);
    doc.line(14, y + 2, 196, y + 2);
    y += 8;

    (doc as any).autoTable({
      startY: y,
      head: [['Indicateur', 'Valeur']],
      body: [
        ['Total interventions',   String(this.kpis.totalInterventions)],
        ['Techniciens actifs',    String(this.kpis.nbTechniciensActifs)],
        ['Taux de résolution',    `${this.kpis.tauxResolutionGlobal}%`],
        ['Produits utilisés',     String(this.kpis.totalProduitsUtilises)],
        ['Mouvements de stock',   String(this.kpis.totalMouvementsStock)]
      ],
      theme: 'grid',
      headStyles: {
        fillColor: orange,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: { fontSize: 10 },
      alternateRowStyles: { fillColor: grisClair },
      columnStyles: {
        0: { cellWidth: 120 },
        1: { cellWidth: 60, fontStyle: 'bold', textColor: orange }
      },
      margin: { left: 14, right: 14 }
    });

    y = (doc as any).lastAutoTable.finalY + 12;

    // ── PERFORMANCE TECHNICIENS ───────────────────────────────────
    doc.setTextColor(...noir);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Performance techniciens', 14, y);
    doc.setDrawColor(...orange);
    doc.line(14, y + 2, 196, y + 2);
    y += 8;

    (doc as any).autoTable({
      startY: y,
      head: [['Technicien', 'Fonction', 'Total', 'Terminées', 'En cours', 'En attente', 'Taux']],
      body: this.techniciens.map(t => [
        `${t.prenom} ${t.nom}`,
        t.fonction,
        String(t.nbInterventions),
        String(t.nbTerminees),
        String(t.nbEnCours),
        String(t.nbEnAttente),
        `${t.tauxResolution}%`
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: orange,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: { fontSize: 9 },
      alternateRowStyles: { fillColor: grisClair },
      columnStyles: {
        6: { fontStyle: 'bold', textColor: orange }
      },
      margin: { left: 14, right: 14 }
    });

    y = (doc as any).lastAutoTable.finalY + 12;

    // ── NOUVELLE PAGE si besoin ───────────────────────────────────
    if (y > 220) { doc.addPage(); y = 15; }

    // ── TOP PRODUITS ─────────────────────────────────────────────
    doc.setTextColor(...noir);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Mouvements de stock — Top produits', 14, y);
    doc.setDrawColor(...orange);
    doc.line(14, y + 2, 196, y + 2);
    y += 8;

    (doc as any).autoTable({
      startY: y,
      head: [['Code', 'Désignation', 'Catégorie', 'Mouvements', 'Entrées', 'Sorties', 'Stock net']],
      body: this.produits.map(p => [
        p.codeProduit,
        p.designation,
        p.categorie,
        String(p.nbMouvements),
        String(p.totalEntrees),
        String(p.totalSorties),
        String(p.stockNet)
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: orange,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8
      },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: grisClair },
      margin: { left: 14, right: 14 }
    });

    y = (doc as any).lastAutoTable.finalY + 12;

    // ── NOUVELLE PAGE si besoin ───────────────────────────────────
    if (y > 220) { doc.addPage(); y = 15; }

    // ── ÉVOLUTION MENSUELLE ──────────────────────────────────────
    doc.setTextColor(...noir);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Évolution mensuelle des interventions', 14, y);
    doc.setDrawColor(...orange);
    doc.line(14, y + 2, 196, y + 2);
    y += 8;

    (doc as any).autoTable({
      startY: y,
      head: [['Mois', 'Année', 'Interventions', 'Terminées', 'Taux résolution']],
      body: this.interventionsParMois.map(i => [
        i.nomMois,
        String(i.annee),
        String(i.nbInterventions),
        String(i.nbTerminees),
        `${i.tauxResolution}%`
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: orange,
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10
      },
      bodyStyles: { fontSize: 10 },
      alternateRowStyles: { fillColor: grisClair },
      columnStyles: {
        4: { fontStyle: 'bold', textColor: orange }
      },
      margin: { left: 14, right: 14 }
    });

    // ── PIED DE PAGE ─────────────────────────────────────────────
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(...gris);
      doc.text(
        `MacSpace v1.0 — Mac Sécurité — Data Warehouse — Page ${i}/${totalPages}`,
        105, 290, { align: 'center' }
      );
    }

    // ── TÉLÉCHARGEMENT ───────────────────────────────────────────
    const fileName = `macspace_datawarehouse_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
    this.isExporting = false;
  }
}