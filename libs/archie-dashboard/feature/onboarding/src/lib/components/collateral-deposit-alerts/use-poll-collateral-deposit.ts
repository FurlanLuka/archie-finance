import { useEffect } from 'react';

import { CollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/api/get-collateral-value';
import { usePollCollateralValue } from '@archie-webapps/shared/data-access/archie-api/collateral/hooks/use-poll-collateral-value';
import { RequestState } from '@archie-webapps/shared/data-access/archie-api/interface';

interface UsePollCollateralDepositParams {
  shouldPoll: boolean;
  onCollateralChange: (collateral: CollateralValue[]) => void;
}

export function usePollCollateralDeposit({ shouldPoll, onCollateralChange }: UsePollCollateralDepositParams) {
  const getCollateralResponse = usePollCollateralValue(shouldPoll);

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
