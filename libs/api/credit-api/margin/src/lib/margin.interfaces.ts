import { GetCollateralValueResponse } from '@archie/api/credit-api/collateral';
import { LiquidationLog } from './liquidation_logs.entity';

export interface LiquidatedCollateralAssets {
  loanRepaymentAmount: number;
  liquidatedAssets: Partial<LiquidationLog>[];
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
