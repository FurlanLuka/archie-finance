import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getCreditLine, CreditLine } from '../api/get-credit-line';

export const LEDGER_QUERY_KEY = 'credit_line';

export const useGetCreditLine = (): QueryResponse<CreditLine> => {
  return useExtendedQuery(LEDGER_QUERY_KEY, async (accessToken: string) => getCreditLine(accessToken));
};
