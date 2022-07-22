import { CollateralValue } from '@archie-webapps/shared/data-access-archie-api/collateral/api/get-collateral-value';

export function formatEntireCollateral(collateral: CollateralValue[]): string {
  const collateralText = collateral.reduce((text, collateralEntry, i) => {
    if (i === 0) {
      return `${collateralEntry.assetAmount} ${collateralEntry.asset}`;
    }

    return `${text}, ${collateralEntry.assetAmount} ${collateralEntry.asset}`;
  }, '');

  return collateralText;
}
