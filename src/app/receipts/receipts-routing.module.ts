import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { ReceiptListComponent } from './receipt-list/receipt-list.component';
import { ReceiptCreateComponent } from './receipt-create/receipt-create.component';

const routes: Routes = [
  { path: '', component: ReceiptListComponent },
  { path: 'create', component: ReceiptCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:postId', component: ReceiptCreateComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ReceiptsRoutingModule {}
