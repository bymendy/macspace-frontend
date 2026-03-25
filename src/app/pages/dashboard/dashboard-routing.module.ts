import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

/**
 * Configuration des routes du module dashboard MacSpace.
 */
const routes: Routes = [
  {
    /* Page principale du dashboard */
    path: '',
    component: DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}