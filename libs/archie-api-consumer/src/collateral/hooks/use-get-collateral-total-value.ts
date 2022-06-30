import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { getCollateralTotalValue, TotalCollateralValue } from '../api/get-collateral-total-value';

export const COLLATERAL_VALUE_RECORD_QUERY_KEY = 'collateral_value_record';

export const useGetCollateralTotalValue = (): QueryResponse<TotalCollateralValue> => {
  return useExtendedQuery(COLLATERAL_VALUE_RECORD_QUERY_KEY, async (accessToken: string) =>
    getCollateralTotalValue(accessToken),
  );
};
