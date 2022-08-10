import { API_URL } from '../../constants';
import { DefaultVariables, postRequest } from '../../helpers';

export interface CreateAccessTokenBody extends DefaultVariables {
  publicToken: string;
}

export interface CreateAccessTokenResponse {
  itemId: string;
}

export const ERROR_LIST = new Map([['PUBLIC_TOKEN_EXPIRED', 'Your token expired. Reconnect to Plaid.']]);

export const createAccessToken = async ({
  accessToken,
  ...body
}: DefaultVariables): Promise<CreateAccessTokenResponse> => {
  // TODO change to API_URL
  //
  return postRequest(
    `http://localhost:80/v1/plaid/access_tokens`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
