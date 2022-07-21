import { GetCollateralValueResponse } from '@archie/api/utils/interfaces/collateral';

export interface LiquidatedCollateralAssets {
  asset: string;
  amount: number;
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
}
