import { AssetPrice } from '@archie/api/ledger-api/data-transfer-objects/types';
import { API_URL } from '@archie/ui/shared/constants';

import { getRequest } from '../../helpers';

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
