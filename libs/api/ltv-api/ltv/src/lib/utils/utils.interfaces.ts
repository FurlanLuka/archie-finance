import { LtvCredit } from '../credit.entity';
import { LtvCollateral } from '../collateral.entity';
import { GetAssetPriceResponse } from '@archie/api/asset-price-api/asset-price';

export interface CreditAssets {
  credit: LtvCredit;
  collateral: LtvCollateral[];
  assetPrices: GetAssetPriceResponse[];
}

export interface MultipleCreditAssets {
  creditPerUser: CreditPerUser[];
  assetPrices: GetAssetPriceResponse[];
}

export interface CreditPerUser {
  credit: LtvCredit;
  collateral: LtvCollateral[];
}

export interface CollateralValue {
  collateral: CollateralWithPrice[];
  collateralBalance: number;
}

export interface CollateralWithPrice {
  asset: string;
  amount: number;
  price: number;
}
