import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getCollateralValue, CollateralValue } from '../api/get-collateral-value';

export const COLLATERAL_VALUE_RECORD_QUERY_KEY = 'collateral_value_record';

export const useGetCollateralValue = (): QueryResponse<CollateralValue[]> => {
  return useExtendedQuery(COLLATERAL_VALUE_RECORD_QUERY_KEY, async (accessToken: string) =>
    getCollateralValue(accessToken),
  );
};
