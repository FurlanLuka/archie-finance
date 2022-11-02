import { InitiateLedgerAssetLiquidationCommandPayload } from '@archie/api/ledger-api/data-transfer-objects';
import { user } from '../../../../test/integration/src/lib/data-stubs';
import { v4 } from 'uuid';

export const initiateLedgerAssetLiquidationCommandPayloadFactory = (
  overrides?: Partial<InitiateLedgerAssetLiquidationCommandPayload>,
): InitiateLedgerAssetLiquidationCommandPayload => ({
  userId: user.id,
  amount: '200.00',
  liquidationId: v4(),
  ...overrides,
});
