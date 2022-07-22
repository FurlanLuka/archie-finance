import { IconName } from '@archie-webapps/ui-icons';

export interface CollateralAsset {
  id: string;
  name: string;
  short: string;
  icon: IconName;
  loan_to_value: number;
  interest_rate: number;
  url: string;
}

export const collateralAssets: Record<string, CollateralAsset> = {
  BTC: {
    id: 'BTC',
    name: 'Bitcoin',
    short: 'BTC',
    icon: 'bitcoin',
    loan_to_value: 50,
    interest_rate: 15,
    url: 'https://www.blockchain.com/btc/address',
  },
  ETH: {
    id: 'ETH',
    name: 'Ethereum',
    short: 'ETH',
    icon: 'ethereum',
    loan_to_value: 50,
    interest_rate: 15,
    url: 'https://etherscan.io/address',
  },
  SOL: {
    id: 'SOL',
    name: 'Solana',
    short: 'SOL',
    icon: 'solana',
    loan_to_value: 50,
    interest_rate: 15,
    url: 'https://explorer.solana.com/address',
  },
  USDC: {
    id: 'USDC',
    name: 'USD Coin',
    short: 'USDC',
    icon: 'usdcoin',
    loan_to_value: 70,
    interest_rate: 15,
    url: 'https://etherscan.io/address',
  },
}

export const collateralAssetsColor = {
  btc: '#f7931a',
  eth: '#627eea',
  sol: '#bd40f2',
  usdc: '#3e73c4',
}
