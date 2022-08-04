import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';

export interface GetPlaidLinkTokenResponse {
  token: string;
}

export const ERROR_LIST = new Map<string, string>([]);

export const getLinkToken = async (accessToken: string): Promise<GetPlaidLinkTokenResponse> => {
  // TODO change to API_URL
  return getRequest<GetPlaidLinkTokenResponse>(
    `http://localhost:80/v1/plaid/link_token`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Access-Control-Allow-Origin': '*',
      },
    },
    ERROR_LIST,
  );
};
