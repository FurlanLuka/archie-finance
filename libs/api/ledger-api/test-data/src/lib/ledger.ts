import {
  InitiateLedgerRecalculationCommandPayload,
  LedgerAccountData,
  LedgerAccountUpdatedPayload,
  LedgerActionType,
} from '@archie/api/ledger-api/data-transfer-objects/types';
import { user } from '@archie/test/integration';

export const initiateLedgerRecalcuationCommandPayloadFactory = (
  overrides?: Partial<InitiateLedgerRecalculationCommandPayload>,
): InitiateLedgerRecalculationCommandPayload => ({
  userIds: [user.id],
  ...overrides,
});

export const ledgerAccountDataFactory = (
  overrides?: Partial<LedgerAccountData>,
): LedgerAccountData => ({
  assetId: 'BTC',
  assetAmount: '1',
  accountValue: '20000',
  assetPrice: '20000',
  calculatedAt: new Date().toISOString(),
  ...overrides,
});

export const ledgerAccountUpdatedPayloadFactory = (
  overrides?: Partial<LedgerAccountUpdatedPayload>,
): LedgerAccountUpdatedPayload => ({
  userId: user.id,
  ledgerAccounts: [ledgerAccountDataFactory()],
  action: {
    type: LedgerActionType.DEPOSIT,
  },
  ...overrides,
});
