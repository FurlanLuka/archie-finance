import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';

export interface MaxWithdrawalAmount {
  maxAmount: string;
}

export const ERROR_LIST = new Map<string, string>([]);

export const getMaxWithdrawalAmount = async (assetId: string, accessToken: string): Promise<MaxWithdrawalAmount> => {
  return getRequest<MaxWithdrawalAmount>(
    `${API_URL}/v1/collateral/withdraw/${assetId}/max_amount`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
