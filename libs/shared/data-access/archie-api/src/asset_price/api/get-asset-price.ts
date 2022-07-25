import { API_URL } from '../../constants';
import { getRequest } from '../../helpers';

export interface AssetPrice {
  asset: string;
  price: number;
  dailyChange: number;
  currency: string;
}

export const ERROR_LIST = new Map<string, string>([]);

export const getAssetPrice = async (accessToken: string): Promise<AssetPrice[]> => {
  return getRequest<AssetPrice[]>(
    `${API_URL}/v1/asset_price`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
