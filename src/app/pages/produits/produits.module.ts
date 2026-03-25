import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ProduitsRoutingModule } from './produits-routing.module';
import { ProduitListComponent } from './produit-list/produit-list.component';
import { ProduitFormComponent } from './produit-form/produit-form.component';

/**
 * Module de gestion des produits MacSpace.
 */
@NgModule({
  declarations: [
    ProduitListComponent,
    ProduitFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProduitsRoutingModule
  ]
})
export class ProduitsModule {}