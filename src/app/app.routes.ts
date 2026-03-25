import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

/**
 * Configuration des routes principales de l'application MacSpace.
 * Les routes protégées nécessitent une authentification via AuthGuard.
 * Le lazy loading est utilisé pour optimiser les performances.
 */
export const routes: Routes = [

  /* Redirection par défaut vers le dashboard */
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  /* Route d'authentification - accessible sans token */
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.module')
        .then(m => m.AuthModule)
  },

  /* Routes protégées - nécessitent une authentification */
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/dashboard/dashboard.module')
        .then(m => m.DashboardModule)
  },
  {
    path: 'clients',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/clients/clients.module')
        .then(m => m.ClientsModule)
  },
  {
    path: 'interventions',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/interventions/interventions.module')
        .then(m => m.InterventionsModule)
  },
  {
    path: 'produits',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/produits/produits.module')
        .then(m => m.ProduitsModule)
  },
  {
    path: 'stock',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/stock/stock.module')
        .then(m => m.StockModule)
  },
  {
    path: 'fournisseurs',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/fournisseurs/fournisseurs.module')
        .then(m => m.FournisseursModule)
  },
  {
    path: 'utilisateurs',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/utilisateurs/utilisateurs.module')
        .then(m => m.UtilisateursModule)
  },

  /* Route 404 - redirection vers dashboard */
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];