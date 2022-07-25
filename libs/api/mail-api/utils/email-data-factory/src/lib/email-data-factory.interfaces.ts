export interface CollateralLiquidatedMail {
  liquidationAmount: number;
  collateralBalance: number;
  ltv: number;
}

export interface MarginInfoMail {
  priceForMarginCall: number;
  collateralBalance: number;
  ltv: number;
  priceForPartialCollateralSale: number;
}
