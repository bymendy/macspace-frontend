import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';

/**
 * Module du tableau de bord MacSpace.
 * Affiche les KPIs et statistiques avec graphiques Chart.js.
 */
@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    NgChartsModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule {}