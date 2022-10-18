import { API_URL } from '@archie-microservices/ui/shared/constants';

import { getRequest } from '../../helpers';

export interface AssetPrice {
  assetId: string;
  price: number;
  dailyChange: number;
  currency: string;
}

export const ERROR_LIST = new Map<string, string>([]);

export const getAssetPrice = async (
  accessToken: string,
): Promise<AssetPrice[]> => {
  return getRequest<AssetPrice[]>(
    `${API_URL}/v1/asset/price`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    ERROR_LIST,
  );
};
