import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatawarehouseRoutingModule } from './datawarehouse-routing.module';
import { DatawarehouseComponent } from './datawarehouse/datawarehouse.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [DatawarehouseComponent],
  imports: [
    CommonModule,
    DatawarehouseRoutingModule,
    NgChartsModule
  ]
})
export class DatawarehouseModule {}