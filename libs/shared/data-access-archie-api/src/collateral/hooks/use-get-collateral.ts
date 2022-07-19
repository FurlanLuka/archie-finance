import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getCollateral, Collateral } from '../api/get-collateral';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries

export const COLLATERAL_RECORD_QUERY_KEY = 'collateral_record';

export const usePollCollateral = (enabled = true): QueryResponse<Collateral[]> => {
  return useExtendedQuery(COLLATERAL_RECORD_QUERY_KEY, async (accessToken: string) => getCollateral(accessToken), {
    enabled,
    refetchInterval: () => 10000,
  });
};
