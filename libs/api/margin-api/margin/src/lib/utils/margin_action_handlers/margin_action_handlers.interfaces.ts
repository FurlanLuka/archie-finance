export interface MarginPrices {
  priceForMarginCall: number;
  priceForPartialCollateralSale: number;
  collateralBalance: number;
}

export interface LiquidationAssets {
  asset: string;
  amount: string;
  price: number;
}

export interface LtvBalances {
  collateralBalance: number;
  utilizedCreditAmount: number;
}
