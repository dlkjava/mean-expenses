import { Component, OnInit } from '@angular/core';
import { Setting, SETTINGS } from '../app.settings';
import { ReceiptsService } from '../receipts/receipts.service';
import { filter } from 'lodash';

export interface Count {
  _id: string;
  count: number;
}

export interface ReceiptTotals {
  categories: Count[];
  totalReceipts: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isLoading = false;
  categories: Setting[];
  totalReceipts: number;
  counts: Count[];

  constructor(public receiptsService: ReceiptsService) { }

  getCategoryCount(categoryKey: string): number {
    const categoryCounts: Count[] = filter(this.counts, (count: Count) => {
      return count._id === categoryKey;
    });
    return categoryCounts[0] ? categoryCounts[0].count : 0;
  }

  ngOnInit() {
    this.isLoading = true;
    this.categories = SETTINGS.categories;

    this.receiptsService.getReceiptsTotals().subscribe((result: ReceiptTotals) => {
      this.isLoading = false;
      this.counts = result.categories;
      this.totalReceipts = result.totalReceipts;
    });
  }

}
