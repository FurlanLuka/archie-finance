import { QueryResponse } from '../../interface';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { useExtendedQuery } from '@archie/api-consumer/helper-hooks';
import { getCollateralTotalValue, TotalCollateralValue } from '../api/get-collateral-total-value';

export const COLLATERAL_VALUE_RECORD_QUERY_KEY = 'collateral_value_record';

export const usePollCollateralTotalValue = (enabled: boolean = true): QueryResponse<TotalCollateralValue> => {
  return useExtendedQuery(
    COLLATERAL_VALUE_RECORD_QUERY_KEY,
    async (accessToken: string) => getCollateralTotalValue(accessToken),
    {
      enabled,
      refetchInterval: () => 10000,
    },
  );
};
