export interface CoinPriceResponse {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
}
