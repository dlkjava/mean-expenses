import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { Receipt } from '../receipt.model';
import { ReceiptsService } from '../receipts.service';

@Component({
  selector: 'app-receipt-list',
  templateUrl: './receipt-list.component.html',
  styleUrls: ['./receipt-list.component.scss']
})
export class ReceiptListComponent implements OnInit, OnDestroy {

  receipts: Receipt[] = [];
  isLoading = false;
  totalReceipts = 0;
  receiptsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private receiptsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public receiptsService: ReceiptsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.receiptsService.getReceipts(this.receiptsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.receiptsSub = this.receiptsService
      .getReceiptUpdateListener()
      .subscribe((receiptData: { receipts: Receipt[]; receiptCount: number }) => {
        this.isLoading = false;
        this.totalReceipts = receiptData.receiptCount;
        this.receipts = receiptData.receipts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.receiptsPerPage = pageData.pageSize;
    this.receiptsService.getReceipts(this.receiptsPerPage, this.currentPage);
  }

  onDelete(receiptId: string) {
    this.isLoading = true;
    this.receiptsService.deleteReceipt(receiptId).subscribe(() => {
      this.receiptsService.getReceipts(this.receiptsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.receiptsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
