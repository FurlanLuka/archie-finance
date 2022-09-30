import { InitiateLedgerAssetLiquidationCommandPayload } from '@archie/api/ledger-api/data-transfer-objects';
import { user } from '@archie/test/integration';

export const initiateLedgerAssetLiquidationCommandPayloadFactory = (
  overrides?: Partial<InitiateLedgerAssetLiquidationCommandPayload>,
): InitiateLedgerAssetLiquidationCommandPayload => ({
  userId: user.id,
  amount: '200.00',
  ...overrides,
});
