import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UtilisateurListComponent } from './utilisateur-list/utilisateur-list.component';

/**
 * Configuration des routes du module utilisateurs MacSpace.
 */
const routes: Routes = [
  {
    /* Liste des utilisateurs */
    path: '',
    component: UtilisateurListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilisateursRoutingModule {}