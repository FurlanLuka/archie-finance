import { useEffect, useState } from 'react';

import { CollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-value';
import { usePollCollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-poll-collateral-value';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';

interface UsePollCollateralDepositParams {
  initialCollateral: CollateralValue[];
  onCollateralAmountChange: () => void;
}

interface UsePollCollateralDepositResult {
  currentCollateral: CollateralValue[];
  startPolling: VoidFunction;
}

function isCollateralAmountEqual(currentCollateral: CollateralValue[], newCollateral: CollateralValue[]) {
  if (currentCollateral.length !== newCollateral.length) {
    return false;
  }

  return currentCollateral.every((collateralAsset) => {
    const matchingAsset = newCollateral.find((newAsset) => newAsset.asset === collateralAsset.asset);
    if (!matchingAsset) {
      return false;
    }

    return collateralAsset.assetAmount === matchingAsset.assetAmount;
  });
}

export function usePollCollateralDeposit({
  onCollateralAmountChange,
  initialCollateral,
}: UsePollCollateralDepositParams): UsePollCollateralDepositResult {
  const [shouldPoll, setShouldPoll] = useState(true);
  const [currentCollateral, setCurrentCollateral] = useState<CollateralValue[]>(initialCollateral);

  const getCollateralResponse = usePollCollateralValue(shouldPoll);

  useEffect(() => {
    // if we're not even polling don't check (same query key is used)
    if (!shouldPoll) {
      return;
    }
    if (getCollateralResponse.state === RequestState.SUCCESS) {
      const newCollateral = getCollateralResponse.data;

      if (!isCollateralAmountEqual(currentCollateral, newCollateral)) {
        setShouldPoll(false);
        onCollateralAmountChange();
      }
      // always update collateral in case the price changed
      setCurrentCollateral(newCollateral);
    }
  }, [shouldPoll, getCollateralResponse, onCollateralAmountChange, currentCollateral]);

  function startPolling() {
    setShouldPoll(true);
  }

  return { currentCollateral, startPolling };
}
