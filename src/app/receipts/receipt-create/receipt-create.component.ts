import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { mimeType } from './mime-type.validator';
import { AuthService } from '../../auth/auth.service';
import { Receipt } from '../receipt.model';
import { ReceiptsService } from '../receipts.service';

@Component({
  selector: 'app-receipt-create',
  templateUrl: './receipt-create.component.html',
  styleUrls: ['./receipt-create.component.scss']
})
export class ReceiptCreateComponent implements OnInit, OnDestroy {
  // enteredTitle = '';
  // enteredContent = '';
  receipt: Receipt;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private receiptId: string;
  private authStatusSub: Subscription;

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
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
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
            content: receiptData.content,
            imagePath: receiptData.imagePath,
            creator: receiptData.creator
          };
          this.form.setValue({
            title: this.receipt.title,
            content: this.receipt.content,
            image: this.receipt.imagePath
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
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.receiptsService.updateReceipt(
        this.receiptId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
