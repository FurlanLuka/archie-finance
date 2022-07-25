import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getCollateral, Collateral } from '../api/get-collateral';

export const COLLATERAL_RECORD_QUERY_KEY = 'collateral_record';

export const useGetCollateral = (): QueryResponse<Collateral[]> => {
  return useExtendedQuery(COLLATERAL_RECORD_QUERY_KEY, async (accessToken: string) => getCollateral(accessToken));
};
