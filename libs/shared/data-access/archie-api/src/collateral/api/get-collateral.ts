import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';

export interface Collateral {
  id: string;
  userId: string;
  asset: string;
  amount: number;
}

export const ERROR_LIST = new Map<string, string>([]);

export const getCollateral = async (accessToken: string): Promise<Collateral[]> => {
  return getRequest<Collateral[]>(
    `${API_URL}/v1/collateral`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
