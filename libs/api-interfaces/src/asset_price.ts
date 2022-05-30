export interface GetAssetPriceResponse {
  asset: string;
  price: number;
  currency: string;
}

export type GetAssetPricesResponse = GetAssetPriceResponse[];
