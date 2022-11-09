import {
  CreditLineUpdatedPayload,
  CreditLineCreatedPayload,
<<<<<<< HEAD
} from '@archie/api/credit-line-api/data-transfer-objects';
import { user } from '@archie/test/integration/data-stubs';
=======
} from '@archie/api/credit-line-api/data-transfer-objects/types';
import { user } from '@archie/test/integration';
>>>>>>> develop

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
