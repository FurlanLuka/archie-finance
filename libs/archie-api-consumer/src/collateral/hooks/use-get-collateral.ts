import { QueryResponse } from '../../interface';
import { getCollateral, Collateral } from '../api/get-collateral';
import { useExtendedQuery } from '@archie/api-consumer/helper-hooks';

export const COLLATERAL_RECORD_QUERY_KEY: string = 'collateral_record';

export const useGetCollateral = (): QueryResponse<Collateral[]> => {
  return useExtendedQuery(
    COLLATERAL_RECORD_QUERY_KEY,
    async (accessToken: string) => getCollateral(accessToken),
    {
      refetchInterval: () => 10000,
    },
  );
};
