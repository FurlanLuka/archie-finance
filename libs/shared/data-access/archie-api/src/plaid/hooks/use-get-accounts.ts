import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getAccounts, GetAccountsResponse } from '../api/get-accounts';

export const ACCOUNTS_RECORD_QUERY_KEY = 'accounts_record';

export const useGetAccounts = (): QueryResponse<GetAccountsResponse> => {
  return useExtendedQuery(ACCOUNTS_RECORD_QUERY_KEY, async (accessToken: string) => getAccounts(accessToken));
};
