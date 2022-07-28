import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getLTV, LTV } from '../api/get-ltv';

export const LTV_RECORD_QUERY_KEY = 'ltv_record';

export const useGetLTV = (): QueryResponse<LTV> => {
  return useExtendedQuery(LTV_RECORD_QUERY_KEY, async (accessToken: string) => getLTV(accessToken));
};
