import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/auth.service';
import { Receipt } from '../receipt.model';
import { ReceiptsService } from '../receipts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Setting, SETTINGS } from '../../app.settings';
import { filter } from 'lodash';

@Component({
  selector: 'app-receipt-category-list',
  templateUrl: './receipt-category-list.component.html',
  styleUrls: ['./receipt-category-list.component.scss']
})
export class ReceiptCategoryListComponent implements OnInit, OnDestroy {

  receipts: Receipt[] = [];
  isLoading = false;
  totalReceipts = 0;
  receiptsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  categoryDisplay: string;
  private category: string;
  private receiptsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public receiptsService: ReceiptsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  // parse the settings for the category display string
  private getCategoryDisplay(categoryKey: string): string {
    const categorySetting: Setting[] = filter(SETTINGS.categories, (setting: Setting) => {
      return setting.value === categoryKey;
    });
    return categorySetting[0] ? categorySetting[0].viewValue : null;
  }

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('category')) {
        this.category = paramMap.get('category');
        this.categoryDisplay = this.getCategoryDisplay(this.category);
      }
    });
    this.receiptsService.getReceiptsByCategory(this.category, this.receiptsPerPage, this.currentPage);
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
