import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getCreditLine, CreditLineResponse } from '../api/get-credit-line';

export const CREDIT_LINE_RECORD_QUERY_KEY = 'credit_line_record';

export const useGetCreditLine = (): QueryResponse<CreditLineResponse> => {
  return useExtendedQuery(CREDIT_LINE_RECORD_QUERY_KEY, async (accessToken: string) => getCreditLine(accessToken));
};
