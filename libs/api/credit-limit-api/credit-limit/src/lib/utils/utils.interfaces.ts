import { Collateral } from '../collateral.entity';

export interface CollateralValue {
  collateral: CollateralWithPrice[];
  collateralBalance: number;
}

export interface CollateralWithPrice {
  asset: string;
  amount: number;
  price: number;
}

export class CollateralWithCalculationDate extends Collateral {
  calculatedAt: string;
}
