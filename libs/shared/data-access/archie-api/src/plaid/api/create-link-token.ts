import { API_URL } from '../../constants';
import { DefaultVariables, postRequest } from '../../helpers';

export type CreatePlaidLinkTokenBody = DefaultVariables;
export interface CreatePlaidLinkTokenResponse {
  token: string;
}

export const ERROR_LIST = new Map<string, string>([]);

export const createLinkToken = async ({
  accessToken,
}: CreatePlaidLinkTokenBody): Promise<CreatePlaidLinkTokenResponse> => {
  // TODO change to API_URL
  return postRequest<Record<string, never>, CreatePlaidLinkTokenResponse>(
    `http://localhost:80/v1/plaid/link_tokens`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
