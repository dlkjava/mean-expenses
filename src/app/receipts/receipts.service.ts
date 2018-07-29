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
                content: receipt.content,
                id: receipt._id,
                imagePath: receipt.imagePath,
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
      content: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addReceipt(title: string, content: string, image: File) {
    const receiptData = new FormData();
    receiptData.append('title', title);
    receiptData.append('content', content);
    receiptData.append('image', image, title);
    this.http
      .post<{ message: string; receipt: Receipt }>(
        BACKEND_URL,
        receiptData
      )
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

  updateReceipt(id: string, title: string, content: string, image: File | string) {
    let receiptData: Receipt | FormData;
    if (typeof image === 'object') {
      receiptData = new FormData();
      receiptData.append('id', id);
      receiptData.append('title', title);
      receiptData.append('content', content);
      receiptData.append('image', image, title);
    } else {
      receiptData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put(BACKEND_URL + id, receiptData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  deleteReceipt(receiptId: string) {
    return this.http.delete(BACKEND_URL + receiptId);
  }
}
