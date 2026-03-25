import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockListComponent } from './stock-list/stock-list.component';

/**
 * Configuration des routes du module stock MacSpace.
 */
const routes: Routes = [
  {
    /* Liste des mouvements de stock */
    path: '',
    component: StockListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule {}