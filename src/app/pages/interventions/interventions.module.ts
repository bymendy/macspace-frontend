import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { InterventionsRoutingModule } from './interventions-routing.module';
import { InterventionListComponent } from './intervention-list/intervention-list.component';
import { InterventionFormComponent } from './intervention-form/intervention-form.component';

/**
 * Module de gestion des interventions MacSpace.
 * Intègre IonicModule pour les composants mobiles
 * (ion-list, ion-item, ion-button, ion-icon...)
 */
@NgModule({
  declarations: [
    InterventionListComponent,  // Liste des interventions
    InterventionFormComponent   // Formulaire création/modification
  ],
  imports: [
    CommonModule,                 // Directives Angular communes
    ReactiveFormsModule,          // Formulaires réactifs Angular
    IonicModule,                  // Composants Ionic (mobile)
    InterventionsRoutingModule    // Routes du module interventions
  ]
})
export class InterventionsModule {}