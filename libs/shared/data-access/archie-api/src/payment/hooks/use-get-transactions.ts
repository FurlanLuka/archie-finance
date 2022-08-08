import { useExtendedInfiniteQuery } from '../../helper-hooks';
import { InfiniteQueryResponse, PaginationParams } from '../../interface';
import { getTransactions, GetTransactionsResponse } from '../api/get-transactions';

const TRANSACTIONS_RECORD_QUERY_KEY = 'transactions_record';

const getNextPage = ({ meta }: GetTransactionsResponse) => {
  if (meta.page * meta.limit + meta.count < meta.totalCount) {
    return meta.page + 1;
  }

  return undefined;
}

const PAGE_SIZE = 10;

export const useGetTransactions = (): InfiniteQueryResponse<GetTransactionsResponse> => {
  return useExtendedInfiniteQuery(
    TRANSACTIONS_RECORD_QUERY_KEY,
    getNextPage,
    async (accessToken: string, paginationParams: PaginationParams) =>
      getTransactions(paginationParams.page, PAGE_SIZE, accessToken),
  );
};
