import { API_URL } from '../../constants';
import { DefaultVariables, postRequest } from '../../helpers';

export interface ConnectAccountBody extends DefaultVariables {
  publicToken: string;
  accountId: string;
}

export const ERROR_LIST = new Map<string, string>([]);

export const connectAccount = async ({ accessToken, ...body }: ConnectAccountBody): Promise<void> => {
  return postRequest(
    `${API_URL}/v1/payment_instruments`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
