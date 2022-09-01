import { LtvCredit } from '../credit.entity';
import { LtvCollateral } from '../collateral.entity';
import { GetAssetPriceResponse } from '@archie/api/asset-price-api/asset-price';

export interface CreditAssets {
  credit: LtvCredit;
  collateral: LtvCollateral[];
  assetPrices: GetAssetPriceResponse[];
}
