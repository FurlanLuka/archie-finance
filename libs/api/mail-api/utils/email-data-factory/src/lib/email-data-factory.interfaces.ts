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

export interface CollateralLiquidatedMailBody {
  firstName: string;
  liquidatedAmount: string;
  collateralValue: string;
  ltv: string;
}

export interface CollateralInfoMailBody {
  firstName: string;
  collateralValue: string;
  ltv: string;
  marginCallValue: string;
  priceThatTriggersSale: string;
  collateralSaleLtv: number;
  liquidationTargetLtv: number;
  marginCallLtv: number;
}
