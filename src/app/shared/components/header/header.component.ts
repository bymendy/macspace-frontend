import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { UtilisateurService } from '../../../core/services/utilisateur.service';
import { Utilisateur } from '../../models/utilisateur';

/**
 * Interface représentant un élément du breadcrumb.
 */
interface BreadcrumbItem {
  label: string;
  url: string;
}

/**
 * Composant du header principal de MacSpace.
 * Affiche le breadcrumb et les informations de l'utilisateur connecté.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  /** Utilisateur connecté */
  utilisateurConnecte: Utilisateur | null = null;

  /** Initiales de l'utilisateur */
  initiales = '';

  /** Fil d'Ariane */
  breadcrumbs: BreadcrumbItem[] = [];

  /** Map des labels de routes */
  private routeLabels: { [key: string]: string } = {
    'dashboard': 'Tableau de bord',
    'clients': 'Clients',
    'nouveau': 'Nouveau',
    'modifier': 'Modifier',
    'produits': 'Produits',
    'interventions': 'Interventions',
    'nouvelle': 'Nouvelle',
    'stock': 'Stock',
    'fournisseurs': 'Fournisseurs',
    'utilisateurs': 'Utilisateurs'
  };

  constructor(
    private authService: AuthService,
    private utilisateurService: UtilisateurService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  /**
   * Charge les infos utilisateur et écoute les changements de route.
   */
  ngOnInit(): void {
    this.loadUtilisateurConnecte();
    this.buildBreadcrumb();

    /* Reconstruire le breadcrumb à chaque navigation */
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.buildBreadcrumb();
    });
  }

  /**
   * Charge l'utilisateur connecté via son email.
   */
  loadUtilisateurConnecte(): void {
    const email = this.authService.getUserEmail();
    if (!email) return;

    this.utilisateurService.findByEmail(email).subscribe({
      next: (utilisateur) => {
        this.utilisateurConnecte = utilisateur;
        this.initiales =
          `${utilisateur.nom.charAt(0)}${utilisateur.prenom.charAt(0)}`;
      }
    });
  }

  /**
   * Construit le fil d'Ariane depuis l'URL courante.
   */
  buildBreadcrumb(): void {
    const url = this.router.url;
    const segments = url.split('/').filter(s => s && !s.match(/^\d+$/));

    this.breadcrumbs = segments.map((segment, index) => {
      const urlUpToSegment = '/' + segments.slice(0, index + 1).join('/');
      return {
        label: this.routeLabels[segment] || segment,
        url: urlUpToSegment
      };
    });
  }

  /**
   * Navigue vers une URL du breadcrumb.
   */
  navigateTo(url: string): void {
    this.router.navigate([url]);
  }

  /**
   * Retourne la classe CSS du badge selon la fonction.
   */
  getFonctionBadgeClass(fonction: string): string {
    switch (fonction?.toUpperCase()) {
      case 'ADMIN': return 'badge-admin';
      case 'MANAGER': return 'badge-manager';
      case 'TECHNICIEN': return 'badge-technicien';
      default: return 'badge-default';
    }
  }

  /**
   * Déconnecte l'utilisateur.
   */
  logout(): void {
    this.authService.logout();
  }
}