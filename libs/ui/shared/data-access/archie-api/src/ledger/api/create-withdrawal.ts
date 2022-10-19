import { API_URL } from '@archie/ui/shared/constants';

import { DefaultVariables, postRequest } from '../../helpers';

export interface CreateWithdrawalBody extends DefaultVariables {
  assetId: string;
  destinationAddress: string;
  amount: string;
}

export interface WithdrawalResponse {
  id: string;
}

const ERROR_LIST = new Map<string, string>([]);

export const createWithdrawal = async ({
  accessToken,
  ...body
}: CreateWithdrawalBody): Promise<WithdrawalResponse> => {
  return postRequest(
    `${API_URL}/v1/ledger/withdraw`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
