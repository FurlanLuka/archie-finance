import { IconName } from '@archie/ui/shared/icons';

export enum CollateralCurrency {
  BTC = 'BTC',
  ETH = 'ETH',
  SOL = 'SOL',
  USDC = 'USDC',
}

export interface CollateralAsset {
  id: CollateralCurrency;
  name: string;
  short: string;
  icon: IconName;
  loan_to_value: number;
  interest_rate: number;
  url: string;
}

export const CollateralAssets: Record<
  CollateralCurrency | string,
  CollateralAsset
> = {
  [CollateralCurrency.BTC]: {
    id: CollateralCurrency.BTC,
    name: 'Bitcoin',
    short: 'BTC',
    icon: 'bitcoin',
    loan_to_value: 65,
    interest_rate: 16,
    url: 'https://www.blockchain.com/btc/address',
  },
  [CollateralCurrency.ETH]: {
    id: CollateralCurrency.ETH,
    name: 'Ethereum',
    short: 'ETH',
    icon: 'ethereum',
    loan_to_value: 60,
    interest_rate: 16,
    url: 'https://etherscan.io/address',
  },
  [CollateralCurrency.SOL]: {
    id: CollateralCurrency.SOL,
    name: 'Solana',
    short: 'SOL',
    icon: 'solana',
    loan_to_value: 50,
    interest_rate: 16,
    url: 'https://explorer.solana.com/address',
  },
  [CollateralCurrency.USDC]: {
    id: CollateralCurrency.USDC,
    name: 'USD Coin',
    short: 'USDC',
    icon: 'usdcoin',
    loan_to_value: 70,
    interest_rate: 16,
    url: 'https://etherscan.io/address',
  },
};

export const CollateralAssetsColor = {
  [CollateralCurrency.BTC]: '#f59d33',
  [CollateralCurrency.ETH]: '#8097ed',
  [CollateralCurrency.SOL]: '#c257ef',
  [CollateralCurrency.USDC]: '#5376ab',
};
