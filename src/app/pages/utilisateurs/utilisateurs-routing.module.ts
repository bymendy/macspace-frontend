import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UtilisateurListComponent } from './utilisateur-list/utilisateur-list.component';
import { UtilisateurFormComponent } from './utilisateur-form/utilisateur-form.component';

/**
 * Configuration des routes du module utilisateurs MacSpace.
 */
const routes: Routes = [
  {
    /* Liste des utilisateurs */
    path: '',
    component: UtilisateurListComponent
  },
  {
    /* Formulaire de création d'un utilisateur */
    path: 'nouveau',
    component: UtilisateurFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtilisateursRoutingModule {}