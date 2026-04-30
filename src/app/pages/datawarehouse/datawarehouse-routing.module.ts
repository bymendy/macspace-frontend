import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatawarehouseComponent } from './datawarehouse/datawarehouse.component';

const routes: Routes = [
  { path: '', component: DatawarehouseComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatawarehouseRoutingModule {}