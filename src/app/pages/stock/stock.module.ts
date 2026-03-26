import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StockRoutingModule } from './stock-routing.module';
import { StockListComponent } from './stock-list/stock-list.component';

/**
 * Module de gestion des mouvements de stock MacSpace.
 */
@NgModule({
  declarations: [
    StockListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StockRoutingModule
  ]
})
export class StockModule {}