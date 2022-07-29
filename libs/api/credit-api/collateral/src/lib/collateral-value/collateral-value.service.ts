import { Collateral } from '../collateral.entity';
import {
  GetAssetPriceResponse,
} from '@archie/api/asset-price-api/asset-price';
import {
  GetCollateralValueResponse,
  GetUserCollateral,
} from '@archie/api/utils/interfaces/collateral';

export class CollateralValueService {
  public getUserCollateralValue(
    userCollateral: Collateral[] | GetUserCollateral,
    assetPrices: GetAssetPriceResponse[],
  ): GetCollateralValueResponse {
    return userCollateral.map((collateral: Collateral) => {
      const assetPrice: GetAssetPriceResponse | undefined = assetPrices.find(
        (asset) => asset.asset === collateral.asset,
      );

      return {
        asset: collateral.asset,
        assetAmount: collateral.amount,
        price:
          assetPrice === undefined ? 0 : collateral.amount * assetPrice.price,
      };
    });
  }
}
