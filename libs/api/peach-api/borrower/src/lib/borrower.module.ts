import { Module } from '@nestjs/common';
import { LoanModule } from './loan/loan.module';
import { PaymentInstrumentModule } from './payment-instrument/payment_instrument.module';
import { PaymentsModule } from './payments/payments.module';
import { ObligationsModule } from './obligations/obligations.module';

@Module({
  controllers: [],
  imports: [
    LoanModule,
    PaymentInstrumentModule,
    PaymentsModule,
    ObligationsModule,
  ],
  providers: [],
  exports: [],
})
export class PeachBorrowerModule {}
