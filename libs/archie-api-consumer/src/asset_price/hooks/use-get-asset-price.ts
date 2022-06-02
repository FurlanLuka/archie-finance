import { QueryResponse } from '../../interface';
import { getAssetPrice, AssetPrice } from '../api/get-asset-price';
import { useExtendedQuery } from '@archie/api-consumer/helper-hooks';

export const ASSET_PRICE_RECORD_QUERY_KEY = 'asset_price_record';

export const useGetAssetPrice = (enabled = true): QueryResponse<AssetPrice[]> => {
  return useExtendedQuery(ASSET_PRICE_RECORD_QUERY_KEY, async (accessToken: string) => getAssetPrice(accessToken), {
    enabled,
  });
};
