import { useExtendedInfiniteQuery } from '../../helper-hooks';
import { InfiniteQueryResponse, PaginationParams } from '../../interface';
import { getLoanPayments } from '../api/get-loan-payments';
import { getTransactions, GetTransactionsResponse } from '../api/get-transactions';
import { getTransactionsDateRange, mergeTransactionsWithLoanPayments } from '../transactions.helpers';

const TRANSACTIONS_RECORD_QUERY_KEY = 'transactions_record';

const getNextPage = ({ meta }: GetTransactionsResponse) => {
  if (meta.page * meta.limit + meta.count < meta.totalCount) {
    return meta.page + 1;
  }

  return undefined;
};

const PAGE_SIZE = 10;

export const useGetTransactions = (): InfiniteQueryResponse<GetTransactionsResponse> => {
  return useExtendedInfiniteQuery(
    TRANSACTIONS_RECORD_QUERY_KEY,
    getNextPage,
    async (accessToken: string, paginationParams: PaginationParams) => {
      const transactionsResponse = await getTransactions(paginationParams.page, PAGE_SIZE, accessToken);

      const dateRange = getTransactionsDateRange(transactionsResponse.data);

      if (dateRange === null) {
        return transactionsResponse;
      }

      const loanPaymentsResponse = await getLoanPayments(accessToken, dateRange.fromDate, dateRange.toDate);

      return {
        meta: transactionsResponse.meta, // we need to keep the old meta, loan payments are just added onto them,
        data: mergeTransactionsWithLoanPayments(transactionsResponse.data, loanPaymentsResponse.data),
      };
    },
  );
};
