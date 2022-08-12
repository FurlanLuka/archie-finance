import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';

import { AccountResponse } from './interfaces';

export type GetLinkableAccountsResponse = AccountResponse[];

export const ERROR_LIST = new Map<string, string>([]);

export const getLinkableAccounts = async (
  accessToken: string,
  itemId: string,
): Promise<GetLinkableAccountsResponse> => {
  return getRequest<GetLinkableAccountsResponse>(
    `${API_URL}/v1/plaid/linkable_accounts/${itemId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
