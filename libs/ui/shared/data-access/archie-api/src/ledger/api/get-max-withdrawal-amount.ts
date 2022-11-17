import { MaxWithdrawalAmountResponse } from '@archie/api/ledger-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

export const ERROR_LIST = new Map<string, string>([]);

export const getMaxWithdrawalAmount = async (
  assetId: string,
  accessToken: string,
): Promise<MaxWithdrawalAmountResponse> => {
  return getRequest<MaxWithdrawalAmountResponse>(
    `${API_URL}/v1/ledger/withdraw/${assetId}/max_amount`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
