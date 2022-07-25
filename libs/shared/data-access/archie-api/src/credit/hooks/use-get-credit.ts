import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getCredit, GetCreditResponse } from '../api/get-credit';

export const CREDIT_RECORD_QUERY_KEY = 'credit_record';

export const useGetCredit = (): QueryResponse<GetCreditResponse> => {
  return useExtendedQuery(CREDIT_RECORD_QUERY_KEY, async (accessToken: string) => getCredit(accessToken));
};
