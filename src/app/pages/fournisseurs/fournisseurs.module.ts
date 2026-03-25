import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FournisseursRoutingModule } from './fournisseurs-routing.module';
import { FournisseurListComponent } from './fournisseur-list/fournisseur-list.component';
import { FournisseurFormComponent } from './fournisseur-form/fournisseur-form.component';

/**
 * Module de gestion des fournisseurs MacSpace.
 */
@NgModule({
  declarations: [
    FournisseurListComponent,
    FournisseurFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FournisseursRoutingModule
  ]
})
export class FournisseursModule {}