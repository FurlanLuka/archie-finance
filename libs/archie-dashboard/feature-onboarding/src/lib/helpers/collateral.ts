import { AssetPrice } from '@archie-webapps/shared/data-access-archie-api/asset_price/api/get-asset-price';
import { Collateral } from '@archie-webapps/shared/data-access-archie-api/collateral/api/get-collateral';
import { collateralAssets } from '@archie-webapps/util-constants';

export function formatEntireCollateral(collateral: Collateral[]): string {
  const collateralText = collateral.reduce((text, asset, i) => {
    if (i === 1) {
      return `${asset.amount} ${asset.asset}`;
    }

    return `${text}, ${asset.amount} ${asset.asset}`;
  }, '');

  return collateralText;
}

export function calculateCollateralValue(collateral: Collateral[], assetPrices: AssetPrice[]): number {
  return collateral.reduce((sum, collateralEntry) => {
    const assetPrice = assetPrices.find((a) => a.asset === collateralEntry.asset);
    const assetInfo = collateralAssets[collateralEntry.asset];

    if (!assetInfo || !assetPrice) {
      console.warn('Missing asset info or price', { assetInfo, assetPrice, collateralEntry });

      return sum;
    }
    const entryValue = collateralEntry.amount * assetPrice.price * (assetInfo.loan_to_value / 100);

    return sum + entryValue;
  }, 0);
}
