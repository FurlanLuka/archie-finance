import { Module } from '@nestjs/common';
import { LoanModule } from './loan/loan.module';
import { PaymentInstrumentModule } from './payment-instrument/payment_instrument.module';

@Module({
  controllers: [],
  imports: [LoanModule, PaymentInstrumentModule],
  providers: [],
  exports: [],
})
export class PeachBorrowerModule {}
