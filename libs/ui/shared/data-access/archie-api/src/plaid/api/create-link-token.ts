import { PlaidLinkToken } from '@archie/api/credit-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { DefaultVariables, postRequest } from '../../helpers';

export type CreatePlaidLinkTokenBody = DefaultVariables;

export const ERROR_LIST = new Map<string, string>([]);

export const createLinkToken = async ({
  accessToken,
}: CreatePlaidLinkTokenBody): Promise<PlaidLinkToken> => {
  return postRequest<Record<string, never>, PlaidLinkToken>(
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
