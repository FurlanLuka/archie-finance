import { Module } from '@nestjs/common';
import { LoanModule } from './loan/loan.module';
import { PaymentInstrumentModule } from './payment-instrument/payment_instrument.module';
import { AutopayModule } from './autopay/autopay.module';
import { PurchasesModule } from './purchases/purchases.module';
import { ObligationsModule } from './obligations/obligations.module';
import { PaymentsModule } from './payments/payments.module';
import { InterestsModule } from './interests/interests.module';
import { LoanBalancesModule } from './loan-balances/loan-balances.module';
import { LoanStatementsModule } from './statements/statements.module';

@Module({
  controllers: [],
  imports: [
    LoanModule,
    PaymentInstrumentModule,
    PaymentsModule,
    PurchasesModule,
    ObligationsModule,
    InterestsModule,
    AutopayModule,
    LoanBalancesModule,
    LoanStatementsModule,
  ],
  providers: [],
  exports: [],
})
export class PeachBorrowerModule {}
