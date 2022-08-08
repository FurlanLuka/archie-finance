import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';

export interface AccountResponse {
  id: string;
  name: string;
  mask: string;
  availableBalance: number;
  currencyISO: string;
  subtype: string;
}

export type GetAccountsResponse = AccountResponse[];

export const ERROR_LIST = new Map<string, string>([]);

export const getAccounts = async (accessToken: string): Promise<GetAccountsResponse> => {
  // TODO change to API_URL
  return getRequest<GetAccountsResponse>(
    `http://localhost:80/v1/plaid/accounts`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
