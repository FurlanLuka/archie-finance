import { GetAssetPriceResponse } from '@archie/api/utils/interfaces/asset_price';

export class GetAssetPriceResponseDto implements GetAssetPriceResponse {
  asset: string;
  price: number;
  dailyChange: number;
  currency: string;
}
