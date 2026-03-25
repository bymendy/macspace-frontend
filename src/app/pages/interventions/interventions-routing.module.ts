import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterventionListComponent } from './intervention-list/intervention-list.component';
import { InterventionFormComponent } from './intervention-form/intervention-form.component';

/**
 * Configuration des routes du module interventions MacSpace.
 */
const routes: Routes = [
  {
    /* Liste des interventions */
    path: '',
    component: InterventionListComponent
  },
  {
    /* Formulaire de création d'une intervention */
    path: 'nouvelle',
    component: InterventionFormComponent
  },
  {
    /* Formulaire de modification d'une intervention */
    path: 'modifier/:id',
    component: InterventionFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterventionsRoutingModule {}