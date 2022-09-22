import { Injectable } from '@nestjs/common';
import { LtvCollateral } from '../collateral.entity';
import { GetAssetPriceResponse } from '@archie/api/asset-price-api/data-transfer-objects';
import { CollateralValue, CollateralWithPrice } from './utils.interfaces';
import { BigNumber } from 'bignumber.js';

@Injectable()
export class CollateralValueUtilService {
  public getCollateralValue(
    collateral: LtvCollateral[],
    assetPrices: GetAssetPriceResponse[],
  ): CollateralValue {
    const collateralValuePerAsset: CollateralWithPrice[] = collateral.map(
      (collateralAsset: LtvCollateral) => {
        const assetPrice: GetAssetPriceResponse | undefined = assetPrices.find(
          (asset) => asset.asset === collateralAsset.asset,
        );

        return {
          asset: collateralAsset.asset,
          amount: collateralAsset.amount,
          price:
            assetPrice === undefined
              ? 0
              : Number(
                  BigNumber(collateralAsset.amount)
                    .multipliedBy(assetPrice.price)
                    .toFixed(2),
                ),
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
