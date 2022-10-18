import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getLoanInterests, LoanInterests } from '../api/get-loan-interests';

export const LTV_RECORD_QUERY_KEY = 'loan_interests_record';

export const useGetLoanInterests = (): QueryResponse<LoanInterests> => {
  return useExtendedQuery(LTV_RECORD_QUERY_KEY, async (accessToken: string) =>
    getLoanInterests(accessToken),
  );
};
