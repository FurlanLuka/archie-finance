import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getLinkableAccounts, GetLinkableAccountsResponse } from '../api/get-linkable-accounts';

const LINKABLE_ACCOUNTS_RECORD_QUERY_KEY = 'linkable_accounts_record';

export function getLinkableAccountsQueryKey(itemId: string) {
  return `${LINKABLE_ACCOUNTS_RECORD_QUERY_KEY}_${itemId}`;
}

export const useGetLinkableAccounts = (itemId: string): QueryResponse<GetLinkableAccountsResponse> => {
  return useExtendedQuery(getLinkableAccountsQueryKey(itemId), async (accessToken: string) =>
    getLinkableAccounts(accessToken, itemId),
  );
};
