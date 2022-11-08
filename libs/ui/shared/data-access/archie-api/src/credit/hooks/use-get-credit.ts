import { LoanBalances } from '@archie/api/peach-api/data-transfer-objects/types';

import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getCredit } from '../api/get-credit';

export const CREDIT_RECORD_QUERY_KEY = 'credit_record';

export const useGetCredit = (): QueryResponse<LoanBalances> => {
  return useExtendedQuery(
    CREDIT_RECORD_QUERY_KEY,
    async (accessToken: string) => getCredit(accessToken),
  );
};
