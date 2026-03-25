import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProduitListComponent } from './produit-list/produit-list.component';
import { ProduitFormComponent } from './produit-form/produit-form.component';

/**
 * Configuration des routes du module produits MacSpace.
 */
const routes: Routes = [
  {
    /* Liste des produits */
    path: '',
    component: ProduitListComponent
  },
  {
    /* Formulaire de création d'un produit */
    path: 'nouveau',
    component: ProduitFormComponent
  },
  {
    /* Formulaire de modification d'un produit */
    path: 'modifier/:id',
    component: ProduitFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProduitsRoutingModule {}