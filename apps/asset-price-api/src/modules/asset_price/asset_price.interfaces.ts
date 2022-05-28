import { AssetPrice } from './asset_price.entity';

export enum CoinApiMessageType {
  EXRATE = 'exrate',
  TRADE = 'TRADE',
}

export interface CoinApiBaseMessage {
  type: CoinApiMessageType.TRADE;
}

export interface CoinApiExrateMessage {
  type: CoinApiMessageType.EXRATE;
  time: string;
  asset_id_base: string;
  asset_id_quote: string;
  rate: number;
}

export type CoinApiMessage = CoinApiBaseMessage | CoinApiExrateMessage;

export type GetAssetPriceResponse = Omit<AssetPrice, 'updatedAt' | 'createdAt'>;

export type GetAssetPricesResponse = GetAssetPriceResponse[];
