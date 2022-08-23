import { Module } from '@nestjs/common';
import { LoanModule } from './loan/loan.module';
import { PaymentInstrumentModule } from './payment-instrument/payment_instrument.module';
import { PaymentsModule } from './payments/payments.module';
import { PurchasesModule } from './purchases/purchases.module';

@Module({
  controllers: [],
  imports: [
    LoanModule,
    PaymentInstrumentModule,
    PaymentsModule,
    PurchasesModule,
  ],
  providers: [],
  exports: [],
})
export class PeachBorrowerModule {}
