import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

  /** Top 5 clients par nombre d'interventions */
  topClients: { nom: string; prenom: string; total: number }[] = [];

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

  /** Graphique évolution mensuelle (Line) */
  evolutionChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      label: 'Interventions',
      data: [],
      borderColor: '#E46C0C',
      backgroundColor: 'rgba(228, 108, 12, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#E46C0C',
      pointRadius: 5
    }]
  };

  evolutionChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: '#f0f0f0' }
      },
      x: {
        grid: { display: false }
      }
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

        /* Graphique évolution mensuelle */
        this.calculerEvolutionMensuelle(data.interventions);

        /* Top clients */
        this.calculerTopClients(data.auditLogs);

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
  /**
 * Calcule l'évolution mensuelle des interventions sur 6 mois.
 */
  calculerEvolutionMensuelle(interventions: Intervention[]): void {
    const mois = [];
    const counts = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
      mois.push(label);

      const count = interventions.filter(intervention => {
        if (!intervention.dateIntervention) return false;
        const d = new Date(intervention.dateIntervention);
        return d.getMonth() === date.getMonth()
          && d.getFullYear() === date.getFullYear();
      }).length;

      counts.push(count);
    }

    this.evolutionChartData = {
      labels: mois,
      datasets: [{
        label: 'Interventions',
        data: counts,
        borderColor: '#E46C0C',
        backgroundColor: 'rgba(228, 108, 12, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#E46C0C',
        pointRadius: 5
      }]
    };
  }

/**
 * Calcule le top 5 clients par nombre d'actions dans l'audit log.
 */
  calculerTopClients(auditLogs: any[]): void {
    const map = new Map<string, { nom: string; total: number }>();

    auditLogs
      .filter(log => log.entite === 'client')
      .forEach(log => {
        const key = log.utilisateurNom || 'Inconnu';
        map.set(key, {
          nom: key,
          total: (map.get(key)?.total || 0) + 1
        });
      });

    this.topClients = Array.from(map.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map(c => ({
        nom: c.nom,
        prenom: '',
        total: c.total
      }));
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
  /**
 * Génère et télécharge un rapport PDF du dashboard MacSpace.
 */
  exporterPDF(): void {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('fr-FR');

    /* En-tête */
    doc.setFontSize(20);
    doc.setTextColor(228, 108, 12);
    doc.text('MacSpace — Mac Sécurité', 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Rapport hebdomadaire — ${date}`, 14, 30);

    /* Ligne de séparation */
    doc.setDrawColor(228, 108, 12);
    doc.line(14, 35, 196, 35);

    /* KPIs principaux */
    doc.setFontSize(14);
    doc.setTextColor(29, 29, 27);
    doc.text('KPIs principaux', 14, 45);

    autoTable(doc, {
      startY: 50,
      head: [['Indicateur', 'Valeur']],
      body: [
        ['Total Clients', this.totalClients.toString()],
        ['Total Interventions', this.totalInterventions.toString()],
        ['Total Produits', this.totalProduits.toString()],
        ['Total Fournisseurs', this.totalFournisseurs.toString()],
        ['Actions tracées (Audit)', this.totalAuditLogs.toString()],
        ['Stocks critiques', this.totalStockCritique.toString()],
        ['Taux de résolution', `${this.tauxResolution}%`]
      ],
      headStyles: { fillColor: [228, 108, 12], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    /* État des interventions */
    const y1 = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setTextColor(29, 29, 27);
    doc.text('État des interventions', 14, y1);

    autoTable(doc, {
      startY: y1 + 5,
      head: [['État', 'Nombre']],
      body: [
        ['En attente', this.interventionsEnAttente.toString()],
        ['En cours', this.interventionsEnCours.toString()],
        ['Terminées', this.interventionsTerminees.toString()],
        ['Annulées', this.interventionsAnnulees.toString()]
      ],
      headStyles: { fillColor: [228, 108, 12], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    /* Top clients */
    const y2 = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setTextColor(29, 29, 27);
    doc.text('Top 5 — Actions sur clients', 14, y2);

    autoTable(doc, {
      startY: y2 + 5,
      head: [['#', 'Utilisateur', 'Actions']],
      body: this.topClients.map((c, i) => [
        (i + 1).toString(),
        c.nom,
        c.total.toString()
      ]),
      headStyles: { fillColor: [228, 108, 12], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    /* Pied de page */
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(
        `MacSpace — Mac Sécurité | Page ${i}/${pageCount}`,
        14,
        doc.internal.pageSize.height - 10
      );
    }

    /* Téléchargement */
    doc.save(`rapport-macspace-${date.replace(/\//g, '-')}.pdf`);
  }
}