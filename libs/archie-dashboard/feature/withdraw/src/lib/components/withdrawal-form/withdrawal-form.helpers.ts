import { calculateCollateralCreditValue, calculateCollateralTotalValue } from '@archie-webapps/archie-dashboard/utils';
import { CollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-value';
import { BigNumber } from 'bignumber.js'

interface GetUpdatedCreditAndTotalResult {
  updatedCreditValue: number;
  updatedCollateralValue: number;
}

export function getUpdatedCreditAndTotal({
  asset,
  withdrawalAmount,
  collateral,
}: {
  asset: string;
  withdrawalAmount: string;
  collateral: CollateralValue[];
}): GetUpdatedCreditAndTotalResult {
  const updatedCollateral = collateral.map((collateralEntry) => {
    if (collateralEntry.asset !== asset) {
      return collateralEntry;
    }
    const newAmount = BigNumber(collateralEntry.assetAmount).minus(withdrawalAmount);

    return {
      ...collateralEntry,
      amount: newAmount,
      price: Number(newAmount.multipliedBy(collateralEntry.price).dividedBy(collateralEntry.assetAmount).toFixed(2))
    };
  });

  return {
    updatedCreditValue: calculateCollateralCreditValue(updatedCollateral),
    updatedCollateralValue: calculateCollateralTotalValue(updatedCollateral),
  };
}
