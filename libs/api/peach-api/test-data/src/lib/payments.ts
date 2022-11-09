import { user } from '@archie/test/integration/data-stubs';
import {
  CreditBalanceUpdatedPayload,
  PaymentType,
} from '@archie/api/peach-api/data-transfer-objects/types';

export const creditBalanceUpdatedFactory = (
  override?: Partial<CreditBalanceUpdatedPayload>,
): CreditBalanceUpdatedPayload => ({
  userId: user.id,
  availableCreditAmount: 100,
  creditLimitAmount: 300,
  utilizationAmount: 200,
  calculatedAt: new Date().toISOString(),
  paymentDetails: {
    type: PaymentType.payment,
    id: 'paymentId',
    amount: 100,
    asset: 'USD',
  },
  ...override,
});
