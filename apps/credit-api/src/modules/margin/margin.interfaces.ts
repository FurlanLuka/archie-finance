export interface LiquidatedCollateralAssets {
  asset: string;
  amount: number;
}

export interface CheckMarginMessage {
  userIds: string[];
}
