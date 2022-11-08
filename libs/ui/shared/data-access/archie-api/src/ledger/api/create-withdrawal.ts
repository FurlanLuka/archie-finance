import {
  WithdrawPayload,
  WithdrawResponse,
} from '@archie/api/ledger-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { DefaultVariables, postRequest } from '../../helpers';

export type CreateWithdrawalBody = DefaultVariables & WithdrawPayload;

const ERROR_LIST = new Map<string, string>([]);

export const createWithdrawal = async ({
  accessToken,
  ...body
}: CreateWithdrawalBody): Promise<WithdrawResponse> => {
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
