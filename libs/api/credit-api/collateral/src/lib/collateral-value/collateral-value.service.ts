import { Collateral } from '../collateral.entity';
import { GetAssetPriceResponse } from '@archie/api/asset-price-api/data-transfer-objects';
import {
  GetCollateralResponse,
  GetCollateralValueResponse,
} from '../collateral.interfaces';
import { BigNumber } from 'bignumber.js';

export class CollateralValueService {
  public getUserCollateralValue(
    userCollateral: Collateral[] | GetCollateralResponse[],
    assetPrices: GetAssetPriceResponse[],
  ): GetCollateralValueResponse[] {
    return userCollateral.map((collateral: Collateral) => {
      const assetPrice: GetAssetPriceResponse | undefined = assetPrices.find(
        (asset) => asset.asset === collateral.asset,
      );

      return {
        asset: collateral.asset,
        assetAmount: collateral.amount,
        price:
          assetPrice === undefined
            ? 0
            : Number(
                BigNumber(collateral.amount)
                  .multipliedBy(assetPrice.price)
                  .toFixed(2),
              ),
      };
    });
  }
}
