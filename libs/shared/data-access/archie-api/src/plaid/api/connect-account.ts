import { API_URL } from '../../constants';
import { DefaultVariables, postRequest } from '../../helpers';

export interface ConnectAccountBody extends DefaultVariables {
  itemId: string;
  accountId: string;
}

export const ERROR_LIST = new Map<string, string>([]);

export const connectAccount = async ({ accessToken, ...body }: DefaultVariables): Promise<void> => {
  // TODO change to API_URL
  //
  return postRequest(
    `http://localhost:80/v1/plaid/connected_accounts`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
