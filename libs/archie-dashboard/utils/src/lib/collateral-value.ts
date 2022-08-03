import { CollateralAssets } from '@archie-webapps/shared/constants';
import { CollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-value';

export const getFormattedValue = (value: number) => value.toLocaleString(undefined, { maximumFractionDigits: 2 });

export const calculateCollateralTotalValue = (collateral: CollateralValue[]): number =>
  collateral.reduce((sum, collateralEntry) => sum + collateralEntry.price, 0);

export const calculateCollateralCreditValue = (collateral: CollateralValue[]): number =>
  collateral.reduce((sum, collateralEntry) => {
    const assetInfo = CollateralAssets[collateralEntry.asset];

    if (!assetInfo) {
      console.warn('Missing asset info', { assetInfo, collateralEntry });

      return sum;
    }

    const entryValue = collateralEntry.price * (assetInfo.loan_to_value / 100);

    return sum + entryValue;
  }, 0);

export const formatEntireCollateral = (collateral: CollateralValue[]): string =>  
  collateral.reduce((text, collateralEntry, i) => {
    if (i === 0) {
      return `${collateralEntry.assetAmount} ${collateralEntry.asset}`;
    }

    return `${text}, ${collateralEntry.assetAmount} ${collateralEntry.asset}`;
  }, '');
