import { Transaction } from '@archie/api/credit-api/data-transfer-objects/types';

import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse, RequestState } from '../../interface';
import { getTransactions } from '../api/get-transactions';

const RECENT_TRANSACTIONS_RECORD_QUERY_KEY = 'recent_transactions_record';

export const useGetRecentTransactions = (): QueryResponse<Transaction[]> => {
  const queryResponse = useExtendedQuery(
    RECENT_TRANSACTIONS_RECORD_QUERY_KEY,
    async (accessToken: string) => getTransactions(0, 5, accessToken),
  );

  // we don't need pagination data here so we just override the success state
  if (queryResponse.state === RequestState.SUCCESS) {
    return {
      state: RequestState.SUCCESS,
      data: queryResponse.data.data,
    };
  }

  return queryResponse;
};
