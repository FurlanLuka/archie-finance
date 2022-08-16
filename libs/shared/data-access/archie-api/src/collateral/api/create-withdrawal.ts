import { API_URL } from '../../constants';
import { DefaultVariables, postRequest } from '../../helpers';

export interface CreateWithdrawalBody extends DefaultVariables {
  asset: string;
  destinationAddress: string;
  withdrawalAmount: number;
}

export interface WithdrawalResponse {
  id: string;
  userId: string;
  asset: string;
  currentAmount: number;
  withdrawalAmount: number;
  transactionId: string;
  status: string; // TODO fireblocks SDK
  createdAt: Date;
  updatedAt: Date;
}

const ERROR_LIST = new Map<string, string>([]);

export const createWithdrawal = async ({ accessToken, ...body }: CreateWithdrawalBody): Promise<WithdrawalResponse> => {
  return postRequest(
    `${API_URL}/v1/collateral/withdraw`,
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
