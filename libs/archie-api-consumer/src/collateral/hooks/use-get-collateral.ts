import { QueryResponse } from '../../interface';
import { getCollateral, Collateral } from '../api/get-collateral';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { useExtendedQuery } from '@archie/api-consumer/helper-hooks';

export const COLLATERAL_RECORD_QUERY_KEY = 'collateral_record';

export const useGetCollateral = (enabled: boolean = true): QueryResponse<Collateral[]> => {
  return useExtendedQuery(COLLATERAL_RECORD_QUERY_KEY, async (accessToken: string) => getCollateral(accessToken), {
    enabled,
    refetchInterval: () => 10000,
  });
};
