import {
  CreditLineUpdatedPayload,
  CreditLineCreatedPayload,
} from '@archie/api/credit-line-api/data-transfer-objects';
import { user } from '../../../../test/integration/src/lib/data-stubs';

export const creditLineCreatedDataFactory = (
  override?: Partial<CreditLineCreatedPayload>,
): CreditLineCreatedPayload => ({
  userId: user.id,
  ledgerValue: 500,
  creditLimit: 250,
  calculatedAt: new Date().toISOString(),
  ...override,
});

export const creditLineUpdatedDataFactory = (
  override?: Partial<CreditLineUpdatedPayload>,
): CreditLineUpdatedPayload => ({
  userId: user.id,
  creditLimit: 100,
  calculatedAt: new Date().toISOString(),
  ...override,
});
