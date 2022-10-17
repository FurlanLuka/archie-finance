export interface LedgerAccountDataWs {
  assetId: string;
  assetAmount: string;
  accountValue: string;
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

export type LedgerAccountAction = LiquidationLedgerAccountAction | OtherLedgerAccountAction;
// TODO use the above import sometime in the future
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
