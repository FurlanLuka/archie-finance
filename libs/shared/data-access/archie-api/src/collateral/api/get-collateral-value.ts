import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';

export interface CollateralValue {
  asset: string;
  assetAmount: number;
  price: number;
}

export const ERROR_LIST = new Map<string, string>([]);

export const getCollateralValue = async (accessToken: string): Promise<CollateralValue[]> => {
  return getRequest<CollateralValue[]>(
    `${API_URL}/v1/collateral/value`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
