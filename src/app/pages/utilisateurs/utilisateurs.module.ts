import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UtilisateursRoutingModule } from './utilisateurs-routing.module';
import { UtilisateurListComponent } from './utilisateur-list/utilisateur-list.component';
import { UtilisateurFormComponent } from './utilisateur-form/utilisateur-form.component';

/**
 * Module de gestion des utilisateurs MacSpace.
 */
@NgModule({
  declarations: [
    UtilisateurListComponent,
    UtilisateurFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UtilisateursRoutingModule
  ]
})
export class UtilisateursModule {}