import { AssetPrice } from "./asset_price.interfaces";

export class AssetPriceDto implements AssetPrice {
  assetId: string;
  price: number;
  dailyChange: number;
  currency: string;
}
