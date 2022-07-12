import { GetCollateralValueResponse } from '../../../../libs/api-interfaces/src/collateral';
import { GetAssetPriceResponse } from '../../../../libs/api-interfaces/src/asset_price';

export const SOL_PRICE = 0.28;
export const BTC_PRICE = 26;
export const ETH_PRICE = 2.4;

export const assetPriceResponse: GetAssetPriceResponse[] = [
  {
    asset: 'BTC',
    price: BTC_PRICE,
    currency: 'USD',
  },
  {
    asset: 'ETH',
    price: ETH_PRICE,
    currency: 'USD',
  },
  {
    asset: 'SOL',
    price: SOL_PRICE,
    currency: 'USD',
  },
  {
    asset: 'USDC',
    price: 2.2,
    currency: 'USD',
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
      amount: 10,
    },
  ];
}

export const collateralValueResponse: GetCollateralValueResponse = [
  {
    asset: 'BTC',
    assetAmount: 1,
    price: 26,
  },
  {
    asset: 'ETH',
    assetAmount: 10,
    price: 24,
  },
  {
    asset: 'SOL',
    assetAmount: 100,
    price: 28,
  },
  {
    asset: 'USDC',
    assetAmount: 10,
    price: 22,
  },
];
