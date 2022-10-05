export interface InitiateLedgerAssetLiquidationCommandPayload {
  userId: string;
  amount: string;
  liquidationId: string;
}

export interface Liquidation {
  status: string;
  assetId: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
}
