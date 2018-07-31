import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Receipt } from './receipt.model';

const BACKEND_URL = environment.apiUrl + '/receipts/';

@Injectable({ providedIn: 'root' })
export class ReceiptsService {
  private receipts: Receipt[] = [];
  private receiptsUpdated = new Subject<{ receipts: Receipt[]; receiptCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getReceipts(receiptsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${receiptsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; receipts: any; maxReceipts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(receiptData => {
          return {
            receipts: receiptData.receipts.map(receipt => {
              return {
                title: receipt.title,
                id: receipt._id,
                imagePath: receipt.imagePath,
                category: receipt.category,
                paymentType: receipt.paymentType,
                date: receipt.date,
                total: receipt.total,
                notes: receipt.notes,
                creator: receipt.creator
              };
            }),
            maxReceipts: receiptData.maxReceipts
          };
        })
      )
      .subscribe(transformedReceiptData => {
        this.receipts = transformedReceiptData.receipts;
        this.receiptsUpdated.next({
          receipts: [...this.receipts],
          receiptCount: transformedReceiptData.maxReceipts
        });
      });
  }

  getReceiptUpdateListener() {
    return this.receiptsUpdated.asObservable();
  }

  getReceipt(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      imagePath: string;
      category: string;
      paymentType: string;
      date: string;
      total: number;
      notes: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  getReceiptsTotals() {
    return this.http.get<{}>(BACKEND_URL + 'totals');
  }

  getReceiptsByCategory(category: string, receiptsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${receiptsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; receipts: any; maxReceipts: number }>(
        BACKEND_URL + 'category/' + category + queryParams
      )
      .pipe(
        map(receiptData => {
          return {
            receipts: receiptData.receipts.map(receipt => {
              return {
                title: receipt.title,
                id: receipt._id,
                imagePath: receipt.imagePath,
                category: receipt.category,
                paymentType: receipt.paymentType,
                date: receipt.date,
                total: receipt.total,
                notes: receipt.notes,
                creator: receipt.creator
              };
            }),
            maxReceipts: receiptData.maxReceipts
          };
        })
      )
      .subscribe(transformedReceiptData => {
        this.receipts = transformedReceiptData.receipts;
        this.receiptsUpdated.next({
          receipts: [...this.receipts],
          receiptCount: transformedReceiptData.maxReceipts
        });
      });
  }

  addReceipt(title: string, image: File, category: string, paymentType: string, date: string, total: number, notes: string) {
    const receiptData = new FormData();
    receiptData.append('title', title);
    receiptData.append('image', image, title);
    receiptData.append('category', category);
    receiptData.append('paymentType', paymentType);
    receiptData.append('date', date);
    receiptData.append('total', total.toString(10));
    receiptData.append('notes', notes);
    this.http
      .post<{ message: string; receipt: Receipt }>(
        BACKEND_URL,
        receiptData
      )
      .subscribe(responseData => {
        this.router.navigate(['/receipts/list']);
      });
  }

  updateReceipt(
    id: string, title: string, image: File | string, category: string, paymentType: string, date: string, total: number, notes: string
  ) {
    let receiptData: Receipt | FormData;
    if (typeof image === 'object') {
      receiptData = new FormData();
      receiptData.append('id', id);
      receiptData.append('title', title);
      receiptData.append('image', image, title);
      receiptData.append('category', category);
      receiptData.append('paymentType', paymentType);
      receiptData.append('date', date);
      receiptData.append('total', total.toString(10));
      receiptData.append('notes', notes);
    } else {
      receiptData = {
        id: id,
        title: title,
        imagePath: image,
        category: category,
        paymentType: paymentType,
        date: date,
        total: total,
        notes: notes,
        creator: null
      };
    }
    this.http
      .put(BACKEND_URL + id, receiptData)
      .subscribe(response => {
        this.router.navigate(['/receipts/list']);
      });
  }

  deleteReceipt(receiptId: string) {
    return this.http.delete(BACKEND_URL + receiptId);
  }
}
