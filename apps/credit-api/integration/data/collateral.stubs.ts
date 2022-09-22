import { GetAssetPriceResponse } from '@archie/api/asset-price-api/data-transfer-objects';
import { GetLoanBalancesResponse } from '@archie/api/peach-api/data-transfer-objects';
import { BigNumber } from 'bignumber.js';

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

export const BTC_STARTING_AMOUNT = '1';
export const ETH_STARTING_AMOUNT = '10';
export const SOL_STARTING_AMOUNT = '100';
export const USDC_STARTING_AMOUNT = '20';

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
      amount: USDC_STARTING_AMOUNT,
    },
  ];
}
export const defaultCollateralTotal = BigNumber(BTC_STARTING_AMOUNT)
  .multipliedBy(BTC_PRICE)
  .plus(BigNumber(ETH_STARTING_AMOUNT).multipliedBy(ETH_PRICE))
  .plus(BigNumber(SOL_STARTING_AMOUNT).multipliedBy(SOL_PRICE))
  .plus(BigNumber(USDC_STARTING_AMOUNT).multipliedBy(1))
  .toNumber();

export const getLoanBalancesResponse: GetLoanBalancesResponse = {
  totalCredit: defaultCollateralTotal / 2,
  availableCredit: (defaultCollateralTotal / 2) * 0.8,
  utilizationAmount: (defaultCollateralTotal / 2) * 0.2,
  calculatedAt: new Date().toISOString(),
};
