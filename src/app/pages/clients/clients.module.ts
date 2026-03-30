import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientListComponent } from './client-list/client-list.component';
import { ClientFormComponent } from './client-form/client-form.component';

/**
 * Module de gestion des clients MacSpace.
 * Intègre IonicModule pour les composants mobiles
 * (ion-list, ion-item, ion-button, ion-searchbar...)
 */
@NgModule({
  declarations: [
    ClientListComponent,  // Liste des clients
    ClientFormComponent   // Formulaire création/modification
  ],
  imports: [
    CommonModule,          // Directives Angular communes (*ngIf, *ngFor...)
    ReactiveFormsModule,   // Formulaires réactifs Angular
    IonicModule,           // Composants Ionic (mobile)
    ClientsRoutingModule   // Routes du module clients
  ]
})
export class ClientsModule {}