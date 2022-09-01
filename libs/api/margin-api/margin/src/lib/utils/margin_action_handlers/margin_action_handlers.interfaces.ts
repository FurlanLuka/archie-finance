export interface MarginPrices {
  priceForMarginCall: number;
  priceForPartialCollateralSale: number;
  collateralBalance: number;
}

export interface LiquidationAssets {
  asset: string;
  amount: number;
  price: number;
}

export interface LtvBalances {
  collateralBalance: number;
  utilizedCreditAmount: number;
}
