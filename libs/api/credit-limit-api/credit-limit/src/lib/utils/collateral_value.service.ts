import { Injectable } from '@nestjs/common';
import { GetAssetPriceResponse } from '@archie/api/asset-price-api/data-transfer-objects';
import {
  CollateralValue,
  CollateralWithCalculationDate,
  CollateralWithPrice,
} from './utils.interfaces';
import { Collateral } from '../collateral.entity';
import { BigNumber } from 'bignumber.js';

@Injectable()
export class CollateralValueUtilService {
  public getCollateralValue(
    collateral: Collateral[] | CollateralWithCalculationDate[],
    assetPrices: GetAssetPriceResponse[],
  ): CollateralValue {
    const collateralValuePerAsset: CollateralWithPrice[] = collateral.map(
      (collateralAsset: CollateralWithCalculationDate | Collateral) => {
        const assetPrice: GetAssetPriceResponse | undefined = assetPrices.find(
          (asset) => asset.asset === collateralAsset.asset,
        );

        return {
          asset: collateralAsset.asset,
          amount: collateralAsset.amount,
          price:
            assetPrice === undefined
              ? 0
              : BigNumber(collateralAsset.amount)
                  .multipliedBy(assetPrice.price)
                  .toNumber(),
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
