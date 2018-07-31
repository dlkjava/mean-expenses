import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PageEvent, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { Receipt } from '../../receipts/receipt.model';
import { ReceiptsService } from '../../receipts/receipts.service';
import { forEach } from 'lodash';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = [
    'title', 'category', 'paymentType', 'date', 'total'
  ];
  dataSource: any;

  receipts: Receipt[] = [];
  isLoading = false;
  totalReceipts = 0;
  receiptsPerPage = 20;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private receiptsSub: Subscription;
  private authStatusSub: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

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

        // add newDate object to the response
        forEach(this.receipts, (receipt) => {
          const newDate = new Date(receipt.date);
          receipt.newDate = newDate;
        });

        this.dataSource = this.receipts;
        this.dataSource.paginator = this.paginator;
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
