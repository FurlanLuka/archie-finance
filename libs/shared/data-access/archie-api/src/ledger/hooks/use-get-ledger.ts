import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getLedger, Ledger } from '../api/get-ledger';

export const LEDGER_QUERY_KEY = 'ledger';

export const useGetLedger = (): QueryResponse<Ledger> => {
  return useExtendedQuery(LEDGER_QUERY_KEY, async (accessToken: string) => getLedger(accessToken));
};
