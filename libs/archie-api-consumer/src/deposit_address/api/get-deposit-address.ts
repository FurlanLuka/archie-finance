import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';

export interface GetDepositAddressResponse {
  address: string;
}

export const ERROR_LIST = new Map<string, string>([]);

export const getDepositAddress = async (
  assetId: string,
  accessToken: string,
): Promise<GetDepositAddressResponse> => {
  return getRequest<GetDepositAddressResponse>(
    `${API_URL}/v1/deposit_address/${assetId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
