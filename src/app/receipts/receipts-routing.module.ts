import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { ReceiptListComponent } from './receipt-list/receipt-list.component';
import { ReceiptCreateComponent } from './receipt-create/receipt-create.component';
import { ReceiptCategoryListComponent } from './receipt-category-list/receipt-category-list.component';

const routes: Routes = [
  { path: 'list', component: ReceiptListComponent },
  { path: 'create', component: ReceiptCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:receiptId', component: ReceiptCreateComponent, canActivate: [AuthGuard] },
  { path: 'category/:category', component: ReceiptCategoryListComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ReceiptsRoutingModule {}
