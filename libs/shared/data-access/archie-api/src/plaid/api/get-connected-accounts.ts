import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';

import { AccountResponse } from './interfaces';

export type GetConnectedAccountsResponse = AccountResponse[];

export const ERROR_LIST = new Map<string, string>([]);

export const getConnectedAccounts = async (accessToken: string): Promise<GetConnectedAccountsResponse> => {
  // TODO change to API_URL
  return getRequest<GetConnectedAccountsResponse>(
    `http://localhost:80/v1/plaid/connected_accounts`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
