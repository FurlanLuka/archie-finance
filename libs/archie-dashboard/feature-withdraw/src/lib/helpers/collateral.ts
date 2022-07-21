import { CollateralValue } from '@archie-webapps/shared/data-access-archie-api/collateral/api/get-collateral-value';
import { collateralAssets } from '@archie-webapps/util-constants';

export function calculateCollateralTotalValue(collateral: CollateralValue[]): number {
  return collateral.reduce((sum, collateralEntry) => {
    return sum + collateralEntry.price;
  }, 0);
}
// TODO unify this with the deposit alert one
export function calculateCollateralCreditValue(collateral: CollateralValue[]): number {
  return collateral.reduce((sum, collateralEntry) => {
    // TODO fix this lookup to [] from array find
    const assetInfo = collateralAssets.find((a) => a.id === collateralEntry.asset);

    if (!assetInfo) {
      console.warn('Missing asset info', { assetInfo, collateralEntry });

      return sum;
    }
    const entryValue = collateralEntry.price * (assetInfo.loan_to_value / 100);

    return sum + entryValue;
  }, 0);
}
