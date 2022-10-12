export class InternalLedgerAccountData {
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

export class Ledger {
  value: string;
  accounts: InternalLedgerAccountData[];
}
 
export interface LedgerAccountUpdatedPayload {
  userId: string;
  ledgerAccounts: LedgerAccountData[];
  action: LedgerAccountAction;
}

export interface InitiateLedgerRecalculationCommandPayload {
  userIds: string[];
}

export enum LedgerActionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  LIQUIDATION = 'LIQUIDATION',
  ASSET_PRICE_UPDATE = 'ASSET_PRICE_UPDATE',
  FEE = 'FEE',
  WITHDRAWAL_FAILURE = 'WITHDRAWAL_FAILURE',
}

interface LiquidationLedgerAccountAction {
  type: LedgerActionType.LIQUIDATION;
  liquidation: {
    id: string;
    usdAmount: string;
  };
}

interface OtherLedgerAccountAction {
  type: Exclude<LedgerActionType, LedgerActionType.LIQUIDATION>;
}

export type LedgerAccountAction =
  | LiquidationLedgerAccountAction
  | OtherLedgerAccountAction;
