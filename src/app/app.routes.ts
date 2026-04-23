import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './shared/components/layout/layout.component';

/**
 * Configuration des routes principales de l'application MacSpace.
 * Les routes protégées utilisent le LayoutComponent comme parent.
 * Le lazy loading est utilisé pour optimiser les performances.
 */
export const routes: Routes = [

  /* Redirection par défaut vers le login */
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },

  /* Landing page — accessible via /landing */
  {
    path: 'landing',
    loadChildren: () =>
      import('./pages/landing/landing.module')
        .then(m => m.LandingModule)
  },

  /* Route d'authentification - accessible sans token */
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.module')
        .then(m => m.AuthModule)
  },

  /* Routes protégées avec layout - nécessitent une authentification */
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module')
            .then(m => m.DashboardModule)
      },
      {
        path: 'clients',
        loadChildren: () =>
          import('./pages/clients/clients.module')
            .then(m => m.ClientsModule)
      },
      {
        path: 'interventions',
        loadChildren: () =>
          import('./pages/interventions/interventions.module')
            .then(m => m.InterventionsModule)
      },
      {
        path: 'produits',
        loadChildren: () =>
          import('./pages/produits/produits.module')
            .then(m => m.ProduitsModule)
      },
      {
        path: 'stock',
        loadChildren: () =>
          import('./pages/stock/stock.module')
            .then(m => m.StockModule)
      },
      {
        path: 'fournisseurs',
        loadChildren: () =>
          import('./pages/fournisseurs/fournisseurs.module')
            .then(m => m.FournisseursModule)
      },
      {
        path: 'utilisateurs',
        loadChildren: () =>
          import('./pages/utilisateurs/utilisateurs.module')
            .then(m => m.UtilisateursModule)
      },
      {
        path: 'audit',
        loadChildren: () =>
          import('./pages/audit/audit.module')
            .then(m => m.AuditModule)
      }
    ]
  },

  /* Route 404 - redirection vers login */
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];