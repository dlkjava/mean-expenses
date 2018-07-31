export interface Setting {
  value: string;
  viewValue: string;
  color?: string;
}

export class SETTINGS {

  // ROYGBIV
  public static categories: Setting[] = [
    {value: 'bills', viewValue: 'Bills', color: 'red'},
    {value: 'household', viewValue: 'Household', color: 'orange'},
    {value: 'food', viewValue: 'Food', color: 'yellow'},
    {value: 'clothing', viewValue: 'Clothing', color: 'green'},
    {value: 'travel', viewValue: 'Travel', color: 'blue'},
    {value: 'entertainment', viewValue: 'Entertainment', color: 'indigo'}
  ];

  public static paymentTypes: Setting[] = [
    {value: 'cash', viewValue: 'Cash'},
    {value: 'check', viewValue: 'Check'},
    {value: 'credit', viewValue: 'Credit'},
    {value: 'debit', viewValue: 'Debit'},
    {value: 'other', viewValue: 'Other'}
  ];

}
