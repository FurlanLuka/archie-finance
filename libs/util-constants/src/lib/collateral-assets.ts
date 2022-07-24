import { IconName } from '@archie-webapps/ui-icons';

export enum CollateralCurrency {
  BTC = 'BTC',
  ETH = 'ETH',
  SOL = 'SOL',
  USDC = 'USDC',
}

export interface CollateralAsset {
  id: string;
  name: string;
  short: string;
  icon: IconName;
  loan_to_value: number;
  interest_rate: number;
  url: string;
}

export const CollateralAssets: Record<CollateralCurrency | string, CollateralAsset> = {
  [CollateralCurrency.BTC]: {
    id: 'BTC',
    name: 'Bitcoin',
    short: 'BTC',
    icon: 'bitcoin',
    loan_to_value: 50,
    interest_rate: 15,
    url: 'https://www.blockchain.com/btc/address',
  },
  [CollateralCurrency.ETH]: {
    id: 'ETH',
    name: 'Ethereum',
    short: 'ETH',
    icon: 'ethereum',
    loan_to_value: 50,
    interest_rate: 15,
    url: 'https://etherscan.io/address',
  },
  [CollateralCurrency.SOL]: {
    id: 'SOL',
    name: 'Solana',
    short: 'SOL',
    icon: 'solana',
    loan_to_value: 50,
    interest_rate: 15,
    url: 'https://explorer.solana.com/address',
  },
  [CollateralCurrency.USDC]: {
    id: 'USDC',
    name: 'USD Coin',
    short: 'USDC',
    icon: 'usdcoin',
    loan_to_value: 70,
    interest_rate: 15,
    url: 'https://etherscan.io/address',
  },
}

export const CollateralAssetsColor = {
  [CollateralCurrency.BTC]: '#f7931a',
  [CollateralCurrency.ETH]: '#627eea',
  [CollateralCurrency.SOL]: '#bd40f2',
  [CollateralCurrency.USDC]: '#3e73c4',
}
