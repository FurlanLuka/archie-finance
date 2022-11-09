import { LoanInterests } from '@archie/api/peach-api/data-transfer-objects/types';

import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getLoanInterests } from '../api/get-loan-interests';

export const LTV_RECORD_QUERY_KEY = 'loan_interests_record';

export const useGetLoanInterests = (): QueryResponse<LoanInterests> => {
  return useExtendedQuery(LTV_RECORD_QUERY_KEY, async (accessToken: string) =>
    getLoanInterests(accessToken),
  );
};
