import { useExtendedInfiniteQuery } from '../../helper-hooks';
import { InfiniteQueryResponse, PaginationParams } from '../../interface';
import { getTransactions, GetTransactionsResponse } from '../api/get-transactions';

const TRANSACTIONS_RECORD_QUERY_KEY = 'transactions_record';

function getNextPage(lastPage: GetTransactionsResponse) {
  return 420;
}

export const useGetTransactions = (): InfiniteQueryResponse<GetTransactionsResponse> => {
  return useExtendedInfiniteQuery(
    TRANSACTIONS_RECORD_QUERY_KEY,
    getNextPage,
    async (accessToken: string, paginationParams: PaginationParams) =>
      getTransactions(paginationParams.page, 2, accessToken),
  );
};
