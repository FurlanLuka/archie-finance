import { GetAssetPriceResponse } from '../../../../libs/api/utils/api-interfaces/src/asset_price';

export const SOL_PRICE = 0.28;
export const BTC_PRICE = 26;
export const ETH_PRICE = 2.4;

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
      amount: 10,
    },
    {
      userId,
      asset: 'SOL',
      amount: 100,
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
