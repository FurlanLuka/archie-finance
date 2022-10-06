export interface InternalLedgerAccountData {
  assetId: string;
  assetAmount: string;
  assetPrice: string;
  accountValue: string;
}

export interface LedgerAccountData {
  assetId: string;
  assetAmount: string;
  accountValue: string;
  calculatedAt: string;
}

export interface Ledger {
  value: string;
  accounts: InternalLedgerAccountData[];
}

export interface LedgerAccountUpdatedPayload {
  userId: string;
  ledgerAccounts: LedgerAccountData[];
  action: LedgerAccountAction;
}

export enum LedgerActionType {
  deposit = 'deposit',
  withdrawal = 'withdrawal',
  liquidation = 'liquidation',
  accountCreated = 'accountCreated',
  assetPriceUpdate = 'assetPriceUpdate',
  fee = 'fee',
  withdrawalFailed = 'withdrawalFailed',
  liquidationFailed = 'liquidationFailed',
}

export interface LedgerAccountAction {
  type: LedgerActionType;
  liquidation?: {
    id: string;
    usdAmount: string;
  };
}

export interface InitiateLedgerRecalculationCommandPayload {
  userIds: string[];
}
