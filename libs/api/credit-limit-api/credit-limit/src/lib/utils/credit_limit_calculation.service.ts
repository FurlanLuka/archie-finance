import { Injectable } from '@nestjs/common';
import {
  CollateralWithPrice,
  CreditLimitPerAsset,
  CreditLimitPerAssetWithCreditLimitTarget,
} from './utils.interfaces';
import { AssetLtv, AssetLtvList } from '../credit_limit.interfaces';

@Injectable()
export class CreditLimitCalculationUtilService {
  public calculateCreditLimit(
    collateralValue: CollateralWithPrice[],
    assetList: AssetLtvList,
  ): number {
    return collateralValue.reduce((sum: number, value: CollateralWithPrice) => {
      const assetInformation: AssetLtv | undefined = assetList[value.asset];

      if (assetInformation === undefined) {
        return sum;
      }

      const actualCollateralValue: number =
        (value.price / 100) * assetInformation.ltv;

      return sum + Math.floor(actualCollateralValue);
    }, 0);
  }

  public calculateCreditLimitPerAsset(
    creditLimit: number,
    collateralValue: CollateralWithPrice[],
    assetList: AssetLtvList,
  ): CreditLimitPerAsset[] {
    const sortedCollateralByAllocation: CollateralWithPrice[] = collateralValue
      .slice()
      .sort((a, b) => (a.price >= b.price ? -1 : 1));

    const creditLimitPerAssets = sortedCollateralByAllocation.reduce(
      (
        creditLimitPerAsset: CreditLimitPerAssetWithCreditLimitTarget,
        value: CollateralWithPrice,
      ) => {
        const assetInformation: AssetLtv | undefined = assetList[value.asset];

        if (assetInformation === undefined) {
          return creditLimitPerAsset;
        }

        const actualCollateralValue: number =
          (value.price / 100) * assetInformation.ltv;

        const assetLimit = Math.floor(actualCollateralValue);

        const limit =
          creditLimitPerAsset.targetLimit - assetLimit > 0
            ? assetLimit
            : creditLimitPerAsset.targetLimit;

        return {
          targetLimit: creditLimitPerAsset.targetLimit - limit,
          assets: [
            ...creditLimitPerAsset.assets,
            {
              asset: value.asset,
              limit: limit,
              utilizationPercentage: (limit / assetLimit) * 100,
            },
          ],
        };
      },
      {
        targetLimit: creditLimit,
        assets: [],
      },
    );

    return creditLimitPerAssets.assets;
  }
}
