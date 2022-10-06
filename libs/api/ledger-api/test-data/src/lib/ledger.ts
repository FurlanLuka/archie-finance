import {
  InitiateLedgerRecalculationCommandPayload,
  LedgerAccountData,
  LedgerAccountUpdatedPayload,
  LedgerActionType,
} from '@archie/api/ledger-api/data-transfer-objects';
import { user } from '@archie/test/integration';
import { v4 } from 'uuid';

export const initiateLedgerRecalcuationCommandPayloadFactory = (
  overrides?: Partial<InitiateLedgerRecalculationCommandPayload>,
) => ({
  userIds: [user.id],
  ...overrides,
});

export const ledgerAccountDataFactory = (
  overrides?: Partial<LedgerAccountData>,
): LedgerAccountData => ({
  assetId: 'BTC',
  assetAmount: '1',
  accountValue: '20000',
  calculatedAt: Date.now(),
  ...overrides,
});

export const ledgerAccountUpdatedPayloadFactory = (
  overrides?: Partial<LedgerAccountUpdatedPayload>,
): LedgerAccountUpdatedPayload => ({
  userId: user.id,
  ledgerAccounts: [ledgerAccountDataFactory()],
  action: {
    type: LedgerActionType.liquidation,
    liquidation: {
      id: v4(),
      usdAmount: '200.00',
    },
  },
  ...overrides,
});
