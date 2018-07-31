import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptCategoryListComponent } from './receipt-category-list.component';

describe('ReceiptCategoryListComponent', () => {
  let component: ReceiptCategoryListComponent;
  let fixture: ComponentFixture<ReceiptCategoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptCategoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
