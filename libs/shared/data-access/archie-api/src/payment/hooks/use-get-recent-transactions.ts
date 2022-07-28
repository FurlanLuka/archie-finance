import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getTransactions, Transaction } from '../api/get-transactions';

const RECENT_TRANSACTIONS_RECORD_QUERY_KEY = 'recent_transactions_record';

export const useGetRecentTransactions = (): QueryResponse<Transaction[]> => {
  return useExtendedQuery(RECENT_TRANSACTIONS_RECORD_QUERY_KEY, async (accessToken: string) =>
    getTransactions(0, 5, accessToken),
  );
};
