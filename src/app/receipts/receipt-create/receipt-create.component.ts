import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { mimeType } from './mime-type.validator';
import { AuthService } from '../../auth/auth.service';
import { Receipt } from '../receipt.model';
import { ReceiptsService } from '../receipts.service';

export interface PaymentType {
  value: string;
  viewValue;
}
export interface Category {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-receipt-create',
  templateUrl: './receipt-create.component.html',
  styleUrls: ['./receipt-create.component.scss']
})
export class ReceiptCreateComponent implements OnInit, OnDestroy {

  receipt: Receipt;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private receiptId: string;
  private authStatusSub: Subscription;

  paymentTypes: PaymentType[] = [
    {value: 'cash', viewValue: 'Cash'},
    {value: 'check', viewValue: 'Check'},
    {value: 'credit', viewValue: 'Credit'},
    {value: 'debit', viewValue: 'Debit'},
    {value: 'other', viewValue: 'Other'}
  ];

  categories: Category[] = [
    {value: 'bills', viewValue: 'Bills'},
    {value: 'household', viewValue: 'Household'},
    {value: 'food', viewValue: 'Food'},
    {value: 'clothing', viewValue: 'Clothing'},
    {value: 'travel', viewValue: 'Travel'},
    {value: 'entertainment', viewValue: 'Entertainment'}
  ];

  constructor(
    public receiptsService: ReceiptsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      // content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      category: new FormControl(null, { validators: [Validators.required] }),
      paymentType: new FormControl(null, { validators: [Validators.required] }),
      date: new FormControl(null, { validators: [Validators.required] }),
      total: new FormControl(null, { validators: [Validators.required, Validators.pattern(/^\d*(?:[.,]\d{1,2})?$/)] }),
      notes: new FormControl(null, { validators: [Validators.required] })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('receiptId')) {
        this.mode = 'edit';
        this.receiptId = paramMap.get('receiptId');
        this.isLoading = true;
        this.receiptsService.getReceipt(this.receiptId).subscribe(receiptData => {
          this.isLoading = false;
          this.receipt = {
            id: receiptData._id,
            title: receiptData.title,
            imagePath: receiptData.imagePath,
            category: receiptData.category,
            paymentType: receiptData.paymentType,
            date: receiptData.date,
            total: receiptData.total,
            notes: receiptData.notes,
            creator: receiptData.creator
          };
          this.form.setValue({
            title: this.receipt.title,
            image: this.receipt.imagePath,
            category: this.receipt.category,
            paymentType: this.receipt.paymentType,
            date: this.receipt.date,
            total: this.receipt.total,
            notes: this.receipt.notes,
          });
        });
      } else {
        this.mode = 'create';
        this.receiptId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSaveReceipt() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.receiptsService.addReceipt(
        this.form.value.title,
        this.form.value.image,
        this.form.value.category,
        this.form.value.paymentType,
        this.form.value.date,
        parseFloat(this.form.value.total),
        this.form.value.notes
      );
    } else {
      this.receiptsService.updateReceipt(
        this.receiptId,
        this.form.value.title,
        this.form.value.image,
        this.form.value.category,
        this.form.value.paymentType,
        this.form.value.date,
        parseFloat(this.form.value.total),
        this.form.value.notes
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
