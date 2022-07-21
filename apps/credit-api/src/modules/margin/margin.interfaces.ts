import { GetCollateralValueResponse } from '@archie-microservices/api-interfaces/collateral';

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
  priceForMarginCall: number;
  priceForPartialCollateralSale: number;
}
