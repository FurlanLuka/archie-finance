import {
  calculateCollateralCreditValue,
  calculateCollateralTotalValue,
} from '@archie-webapps/archie-dashboard/util/collateral';
import { CollateralValue } from '@archie-webapps/shared/data-access-archie-api/collateral/api/get-collateral-value';

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
  withdrawalAmount: number;
  collateral: CollateralValue[];
}): GetUpdatedCreditAndTotalResult {
  const updatedCollateral = collateral.map((collateralEntry) => {
    if (collateralEntry.asset !== asset) {
      return collateralEntry;
    }
    const newAmount = collateralEntry.assetAmount - withdrawalAmount;

    return {
      ...collateralEntry,
      amount: newAmount,
      price: (newAmount * collateralEntry.price) / collateralEntry.assetAmount,
    };
  });

  return {
    updatedCreditValue: calculateCollateralCreditValue(updatedCollateral),
    updatedCollateralValue: calculateCollateralTotalValue(updatedCollateral),
  };
}
