import { API_URL } from '@archie/ui/shared/constants';

import { DefaultVariables, postRequest } from '../../helpers';

export type CreatePlaidLinkTokenBody = DefaultVariables;
export interface CreatePlaidLinkTokenResponse {
  token: string;
}

export const ERROR_LIST = new Map<string, string>([]);

export const createLinkToken = async ({
  accessToken,
}: CreatePlaidLinkTokenBody): Promise<CreatePlaidLinkTokenResponse> => {
  return postRequest<Record<string, never>, CreatePlaidLinkTokenResponse>(
    `${API_URL}/v1/plaid/link_tokens`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
