import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

export interface AccountResponse {
  id: string;
  name: string;
  mask: string;
  subtype: string;
}

export type GetConnectedAccountsResponse = AccountResponse[];

export const ERROR_LIST = new Map<string, string>([]);

export const getConnectedAccounts = async (
  accessToken: string,
): Promise<GetConnectedAccountsResponse> => {
  return getRequest<GetConnectedAccountsResponse>(
    `${API_URL}/v1/payment_instruments`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
