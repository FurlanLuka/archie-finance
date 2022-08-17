import { API_URL } from '../../constants';
import { DefaultVariables, postRequest } from '../../helpers';

export interface ConnectAccountBody extends DefaultVariables {
  itemId: string;
  accountId: string;
}

export const ERROR_LIST = new Map<string, string>([]);

export const connectAccount = async ({ accessToken, ...body }: DefaultVariables): Promise<void> => {
  return postRequest(
    `${API_URL}/v1/plaid/connected_accounts`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
