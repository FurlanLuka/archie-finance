import { Injectable } from '@nestjs/common';
import { GetAssetPriceResponse } from '@archie/api/asset-price-api/asset-price';
import {
  CollateralValue,
  CollateralWithCalculationDate,
  CollateralWithPrice,
} from './utils.interfaces';

@Injectable()
export class CollateralValueUtilService {
  public getCollateralValue(
    collateral: CollateralWithCalculationDate[],
    assetPrices: GetAssetPriceResponse[],
  ): CollateralValue {
    const collateralValuePerAsset: CollateralWithPrice[] = collateral.map(
      (collateralAsset: CollateralWithCalculationDate) => {
        const assetPrice: GetAssetPriceResponse | undefined = assetPrices.find(
          (asset) => asset.asset === collateralAsset.asset,
        );

        return {
          asset: collateralAsset.asset,
          amount: collateralAsset.amount,
          price:
            assetPrice === undefined
              ? 0
              : collateralAsset.amount * assetPrice.price,
        };
      },
    );
    const collateralValue: number = collateralValuePerAsset.reduce(
      (value: number, collateralAsset: CollateralWithPrice) =>
        value + collateralAsset.price,
      0,
    );

    return {
      collateral: collateralValuePerAsset,
      collateralBalance: collateralValue,
    };
  }
}
