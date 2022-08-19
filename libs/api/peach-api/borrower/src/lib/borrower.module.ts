import { Module } from '@nestjs/common';
import { LoanModule } from './loan/loan.module';
import { PaymentInstrumentModule } from './payment-instrument/payment_instrument.module';
import { AutopayModule } from './autopay/autopay.module';

@Module({
  controllers: [],
  imports: [LoanModule, PaymentInstrumentModule, AutopayModule],
  providers: [],
  exports: [],
})
export class PeachBorrowerModule {}
