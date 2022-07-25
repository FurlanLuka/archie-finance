import { GetCollateralValueResponse } from '@archie/api/utils/interfaces/collateral';
import { LiquidationLog } from './liquidation_logs.entity';

export interface LiquidatedCollateralAssets {
  loanRepaymentAmount: number;
  liquidatedAssets: Partial<LiquidationLog>[];
}

export interface CheckMarginMessage {
  userIds: string[];
}

export interface UsersLtv {
  userId: string;
  ltv: number;
  loanedBalance: number;
  collateralBalance: number;
  collateralAllocation: GetCollateralValueResponse;
  userOnlyHasStableCoins: boolean;
  priceForMarginCall: number;
  priceForPartialCollateralSale: number;
}
