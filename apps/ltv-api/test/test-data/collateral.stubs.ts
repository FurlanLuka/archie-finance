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

export const BTC_STARTING_AMOUNT = 1;
export const ETH_STARTING_AMOUNT = 10;
export const SOL_STARTING_AMOUNT = 100;

export function createUserCollateral(userId: string) {
  return [
    {
      userId,
      asset: 'BTC',
      amount: BTC_STARTING_AMOUNT,
    },
    {
      userId,
      asset: 'ETH',
      amount: ETH_STARTING_AMOUNT,
    },
    {
      userId,
      asset: 'SOL',
      amount: SOL_STARTING_AMOUNT,
    },
    {
      userId,
      asset: 'USDC',
      amount: 22,
    },
  ];
}
export const defaultCollateralTotal =
  BTC_STARTING_AMOUNT * BTC_PRICE + 10 * ETH_PRICE + 100 * SOL_PRICE + 22 * 1;
