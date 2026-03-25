import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientFormComponent } from './client-form/client-form.component';

/**
 * Configuration des routes du module clients MacSpace.
 */
const routes: Routes = [
  {
    /* Liste des clients */
    path: '',
    component: ClientListComponent
  },
  {
    /* Formulaire de création d'un client */
    path: 'nouveau',
    component: ClientFormComponent
  },
  {
    /* Formulaire de modification d'un client */
    path: 'modifier/:id',
    component: ClientFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule {}