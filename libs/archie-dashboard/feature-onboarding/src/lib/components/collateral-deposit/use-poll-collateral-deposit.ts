import { useEffect } from 'react';

import { Collateral } from '@archie-webapps/shared/data-access-archie-api/collateral/api/get-collateral';
import { usePollCollateral } from '@archie-webapps/shared/data-access-archie-api/collateral/hooks/use-get-collateral';
import { RequestState } from '@archie-webapps/shared/data-access-archie-api/interface';

interface UsePollCollateralDepositParams {
  shouldPoll: boolean;
  onCollateralChange: (collateral: Collateral[]) => void;
}

export function usePollCollateralDeposit({ shouldPoll, onCollateralChange }: UsePollCollateralDepositParams) {
  const getCollateralResponse = usePollCollateral(shouldPoll);

  useEffect(() => {
    // if we're not even polling don't check (same query key is used)
    if (!shouldPoll) {
      return;
    }
    if (getCollateralResponse.state === RequestState.SUCCESS) {
      onCollateralChange(getCollateralResponse.data);
    }
  }, [shouldPoll, getCollateralResponse, onCollateralChange]);
}
