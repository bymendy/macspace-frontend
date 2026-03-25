import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InterventionsRoutingModule } from './interventions-routing.module';
import { InterventionListComponent } from './intervention-list/intervention-list.component';
import { InterventionFormComponent } from './intervention-form/intervention-form.component';

/**
 * Module de gestion des interventions MacSpace.
 */
@NgModule({
  declarations: [
    InterventionListComponent,
    InterventionFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InterventionsRoutingModule
  ]
})
export class InterventionsModule {}