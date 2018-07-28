import { ReceiptsModule } from './receipts.module';

describe('ReceiptsModule', () => {
  let receiptsModule: ReceiptsModule;

  beforeEach(() => {
    receiptsModule = new ReceiptsModule();
  });

  it('should create an instance', () => {
    expect(receiptsModule).toBeTruthy();
  });
});
