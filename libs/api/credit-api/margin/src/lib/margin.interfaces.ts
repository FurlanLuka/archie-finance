import { GetCollateralValueResponse } from '@archie/api/credit-api/collateral';
import { MarginCall } from '@archie/api/credit-api/margin';

export interface LiquidatedCollateralAssets {
  loanRepaymentAmount: number;
  liquidatedAssets: LiquidatedAssets[];
}

export interface LiquidatedAssets {
  asset: string;
  amount: number;
  userId: string;
  marginCall: MarginCall;
  price: number;
}

export interface UsersLtv {
  userId: string;
  ltv: number;
  loanedBalance: number;
  collateralBalance: number;
  collateralAllocation: GetCollateralValueResponse[];
  priceForMarginCall: number;
  priceForPartialCollateralSale: number;
}

export interface LtvResponse {
  ltv: number;
  status: LtvStatus;
  loanedBalance: number;
}

export enum LtvStatus {
  good = 'good',
  ok = 'ok',
  warning = 'warning',
  margin_call = 'margin_call',
}
