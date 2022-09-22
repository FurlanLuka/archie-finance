import { LtvCredit } from '../credit.entity';
import { GetAssetPriceResponse } from '@archie/api/asset-price-api/data-transfer-objects';

export interface CreditAssets {
  credit: LtvCredit;
  collateral: CollateralWithCalculationDate[];
  assetPrices: GetAssetPriceResponse[];
}

export interface MultipleCreditAssets {
  creditPerUser: CreditPerUser[];
  assetPrices: GetAssetPriceResponse[];
}

export interface CreditPerUser {
  credit: LtvCredit;
  collateral: CollateralWithCalculationDate[];
}

export interface CollateralValue {
  collateral: CollateralWithPrice[];
  collateralBalance: number;
}

export interface CollateralWithPrice {
  asset: string;
  amount: string;
  price: number;
}

export interface CollateralWithCalculationDate {
  id: string;
  userId: string;
  asset: string;
  amount: string;
  createdAt: Date;
  updatedAt: Date;
}
