import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import {
  getConnectedAccounts,
  GetConnectedAccountsResponse,
} from '../api/get-connected-accounts';

export const CONNECTED_ACCOUNTS_RECORD_QUERY_KEY = [
  'connected_accounts_record',
];

export const useGetConnectedAccounts =
  (): QueryResponse<GetConnectedAccountsResponse> => {
    return useExtendedQuery(
      CONNECTED_ACCOUNTS_RECORD_QUERY_KEY,
      async (accessToken: string) => getConnectedAccounts(accessToken),
    );
  };
