import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditRoutingModule } from './audit-routing.module';
import { AuditComponent } from './audit.component';

/**
 * Module du tableau de bord Audit Trail MacSpace.
 */
@NgModule({
  declarations: [AuditComponent],
  imports: [
    CommonModule,
    FormsModule,
    AuditRoutingModule
  ]
})
export class AuditModule {}