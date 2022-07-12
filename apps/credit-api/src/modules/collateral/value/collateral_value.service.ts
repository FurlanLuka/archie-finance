import { Collateral } from '../collateral.entity';
import {
  GetAssetPriceResponse,
  GetAssetPricesResponse,
} from '@archie-microservices/api-interfaces/asset_price';
import {
  GetCollateralValueResponse,
  GetUserCollateral,
} from '@archie-microservices/api-interfaces/collateral';

export class CollateralValueService {
  public getUserCollateralValue(
    userCollateral: Collateral[] | GetUserCollateral,
    assetPrices: GetAssetPricesResponse,
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
