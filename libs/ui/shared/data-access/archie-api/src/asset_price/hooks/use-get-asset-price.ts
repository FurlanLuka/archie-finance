import { AssetPrice } from '@archie/api/ledger-api/data-transfer-objects/types';

import { useExtendedQuery } from '../../helper-hooks';
import { QueryResponse } from '../../interface';
import { getAssetPrice } from '../api/get-asset-price';

export const ASSET_PRICE_RECORD_QUERY_KEY = ['asset_price_record'];

export const useGetAssetPrice = (
  enabled = true,
): QueryResponse<AssetPrice[]> => {
  return useExtendedQuery(
    ASSET_PRICE_RECORD_QUERY_KEY,
    async (accessToken: string) => getAssetPrice(accessToken),
    {
      enabled,
    },
  );
};
