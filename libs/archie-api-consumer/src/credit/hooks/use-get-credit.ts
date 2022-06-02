import { QueryResponse } from '../../interface';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { useExtendedQuery } from '@archie/api-consumer/helper-hooks';
import { getCredit, GetCreditResponse } from '../api/get-credit';

export const CREDIT_RECORD_QUERY_KEY = 'credit_record';

export const useGetCredit = (): QueryResponse<GetCreditResponse> => {
  return useExtendedQuery(
    CREDIT_RECORD_QUERY_KEY,
    async (accessToken: string) => getCredit(accessToken),
  );
};
