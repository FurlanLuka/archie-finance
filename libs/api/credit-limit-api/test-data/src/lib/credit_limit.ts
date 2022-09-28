import {
  CreditLimitUpdatedPayload,
  CreditLineCreatedPayload,
} from '@archie/api/credit-limit-api/data-transfer-objects';
import { user } from '@archie/test/integration';

export const creditLineCreatedDataFactory = (
  override?: Partial<CreditLineCreatedPayload>,
): CreditLineCreatedPayload => ({
  userId: user.id,
  amount: 500,
  downPayment: 100,
  calculatedAt: new Date().toISOString(),
  ...override,
});

export const creditLimitUpdatedDataFactory = (
  override?: Partial<CreditLimitUpdatedPayload>,
): CreditLimitUpdatedPayload => ({
  userId: user.id,
  creditLimit: 100,
  calculatedAt: new Date().toISOString(),
  ...override,
});
