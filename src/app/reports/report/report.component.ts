import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PageEvent, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { Receipt } from '../../receipts/receipt.model';
import { ReceiptsService } from '../../receipts/receipts.service';
import { forEach, sumBy } from 'lodash';

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
  receiptsCount = 0;
  receiptsTotal = 0;
  receiptsPerPage = 20;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private receiptsSub: Subscription;
  private authStatusSub: Subscription;

  @ViewChild(MatSort) sort: MatSort;
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
        this.receiptsCount = receiptData.receiptCount;
        this.receipts = receiptData.receipts;
        this.receiptsTotal = sumBy(this.receipts, 'total');
        // convert the date string into a Date object so that the date pipe filter can be used on view side
        forEach(this.receipts, (receipt) => {
          receipt.date = new Date(receipt.date);
        });

        this.dataSource = new MatTableDataSource(this.receipts);
        this.dataSource.sort = this.sort;
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Gets the total of all receipts. */
  getReceiptsTotal(): number {
    // TODO: test to compare these 2 options for large dataset
    // NOTE: both of these return correct totals from client side, but not sure which is best
    //    defaulting to the lodash library as it is most likly the most effecient
    //    should do some unit testing for this with a large data set and timestamps to verify
    // return this.dataSource && this.dataSource.filteredData.map(r => r.total).reduce((acc, value) => acc + value, 0);
    return this.dataSource && this.dataSource.filteredData ? sumBy(this.dataSource.filteredData, 'total') : 0;
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
