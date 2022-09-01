import { Injectable } from '@nestjs/common';
import { LtvCollateral } from '../collateral.entity';
import { GetAssetPriceResponse } from '@archie/api/asset-price-api/asset-price';

@Injectable()
export class CollateralValueUtilService {
  public getCollateralValue(
    collateral: LtvCollateral[],
    assetPrices: GetAssetPriceResponse[],
  ): number {
    const collateralValuePerAsset: number[] = collateral.map(
      (collateralAsset: LtvCollateral) => {
        const assetPrice: GetAssetPriceResponse | undefined = assetPrices.find(
          (asset) => asset.asset === collateralAsset.asset,
        );

        return assetPrice === undefined
          ? 0
          : collateralAsset.amount * assetPrice.price;
      },
    );

    return collateralValuePerAsset.reduce(
      (value: number, price: number) => value + price,
      0,
    );
  }
}
