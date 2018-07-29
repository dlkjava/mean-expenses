import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '../angular-material.module';
import { ReceiptCreateComponent } from './receipt-create/receipt-create.component';
import { ReceiptListComponent } from './receipt-list/receipt-list.component';
import { ReceiptsRoutingModule } from './receipts-routing.module';

@NgModule({
  declarations: [ReceiptCreateComponent, ReceiptListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    ReceiptsRoutingModule
  ]
})
export class ReceiptsModule { }
