import { LtvResponse, LtvStatus } from './margin.interfaces';

export class LtvResponseDto implements LtvResponse {
  ltv: number;
  status: LtvStatus;
}

export class MarginCallCompleted {
  userId: string;
  liquidation: {
    asset: string;
    amount: number;
    price: number;
  }[];
  liquidationAmount: number;
  ltv: number;
  priceForMarginCall: number;
  priceForPartialCollateralSale: number;
  collateralBalance: number;
}
