import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FournisseurListComponent } from './fournisseur-list/fournisseur-list.component';
import { FournisseurFormComponent } from './fournisseur-form/fournisseur-form.component';

/**
 * Configuration des routes du module fournisseurs MacSpace.
 */
const routes: Routes = [
  {
    /* Liste des fournisseurs */
    path: '',
    component: FournisseurListComponent
  },
  {
    /* Formulaire de création d'un fournisseur */
    path: 'nouveau',
    component: FournisseurFormComponent
  },
  {
    /* Formulaire de modification d'un fournisseur */
    path: 'modifier/:id',
    component: FournisseurFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FournisseursRoutingModule {}