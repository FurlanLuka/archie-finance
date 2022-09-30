export interface InitiateLedgerAssetLiquidationCommandPayload {
  userId: string;
  amount: string;
}

export interface Liquidation {
  status: string;
  assetId: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
}