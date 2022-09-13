import { GetAssetPriceResponse } from '@archie/api/asset-price-api/asset-price';

export const SOL_PRICE = 100;
export const BTC_PRICE = 20000;
export const ETH_PRICE = 1000;

export const assetPriceResponse: GetAssetPriceResponse[] = [
  {
    asset: 'BTC',
    price: BTC_PRICE,
    currency: 'USD',
    dailyChange: 0,
  },
  {
    asset: 'ETH',
    price: ETH_PRICE,
    currency: 'USD',
    dailyChange: 0,
  },
  {
    asset: 'SOL',
    price: SOL_PRICE,
    currency: 'USD',
    dailyChange: 0,
  },
  {
    asset: 'USDC',
    price: 1,
    currency: 'USD',
    dailyChange: 0,
  },
];
