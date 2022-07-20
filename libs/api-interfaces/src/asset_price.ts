export interface GetAssetPriceResponse {
  asset: string;
  price: number;
  dailyChange: number;
  currency: string;
}

export type GetAssetPricesResponse = GetAssetPriceResponse[];
