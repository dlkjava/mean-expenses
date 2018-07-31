import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportComponent } from './report/report.component';
import { AngularMaterialModule } from '../angular-material.module';
import { RouterModule } from '@angular/router';
import { ReportsRoutingModule } from './reports-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule,
    ReportsRoutingModule

  ],
  declarations: [ReportComponent]
})
export class ReportsModule { }
