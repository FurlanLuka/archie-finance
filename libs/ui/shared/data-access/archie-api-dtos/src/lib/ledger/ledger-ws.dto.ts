export interface LedgerAccountDataWs {
  assetId: string;
  assetAmount: string;
  accountValue: string;
  assetPrice: string;
  calculatedAt: string;
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

export interface LedgerAccountUpdatedPayload {
  userId: string;
  ledgerAccounts: LedgerAccountDataWs[];
  action: LedgerAccountAction;
}

export enum LedgerActionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  LIQUIDATION = 'LIQUIDATION',
  ASSET_PRICE_UPDATE = 'ASSET_PRICE_UPDATE',
  FEE = 'FEE',
  WITHDRAWAL_FAILURE = 'WITHDRAWAL_FAILURE',
}
