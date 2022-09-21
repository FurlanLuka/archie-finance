import { Injectable } from '@nestjs/common';
import { CollateralWithPrice } from '@archie/api/ltv-api/data-transfer-objects';
import { LiquidationAssets } from './margin_action_handlers.interfaces';
import { BigNumber } from 'bignumber.js';

@Injectable()
export class LiquidationUtilService {
  public getAssetsToLiquidate(
    amount: number,
    collateral: CollateralWithPrice[],
  ): LiquidationAssets[] {
    const sortedCollateralAssetsByAllocation: CollateralWithPrice[] = collateral
      .slice()
      .sort((a: CollateralWithPrice, b: CollateralWithPrice) =>
        a.price >= b.price ? -1 : 1,
      );

    let targetLiquidationAmount: number = amount;

    return sortedCollateralAssetsByAllocation
      .map((collateralValue: CollateralWithPrice): LiquidationAssets => {
        if (targetLiquidationAmount > 0) {
          let newCollateralAssetPrice: number =
            collateralValue.price - targetLiquidationAmount;

          if (newCollateralAssetPrice >= 0) {
            const amountToTake: number =
              collateralValue.price - newCollateralAssetPrice;
            targetLiquidationAmount -= amountToTake;
          } else {
            newCollateralAssetPrice = 0;
            targetLiquidationAmount -= collateralValue.price;
          }

          const assetPricePerUnit = BigNumber(collateralValue.price).dividedBy(
            BigNumber(collateralValue.amount),
          );

          const newCollateralAssetAmount: BigNumber = BigNumber(
            newCollateralAssetPrice,
          ).dividedBy(assetPricePerUnit);

          return {
            asset: collateralValue.asset,
            amount: BigNumber(collateralValue.amount)
              .minus(newCollateralAssetAmount)
              .toString(),
            price: collateralValue.price - newCollateralAssetPrice,
          };
        }

        return {
          asset: collateralValue.asset,
          amount: '0',
          price: 0,
        };
      })
      .filter((liquidatedAsset) => !BigNumber(liquidatedAsset.amount).isZero());
  }
}
