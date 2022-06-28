import { Bitcoin, Ethereum, Solana, Usdcoin } from '@archie-webapps/ui-icons';
import { ReactElement } from 'react';

export interface CollateralAsset {
  id: string;
  name: string;
  short: string;
  icon: ReactElement;
  loan_to_value: number;
  interest_rate: number;
  url: string;
}

export const collateralAssets: CollateralAsset[] = [
  {
    id: 'BTC',
    name: 'Bitcoin',
    short: 'BTC',
    icon: <Bitcoin />,
    loan_to_value: 50,
    interest_rate: 15,
    url: 'https://www.blockchain.com/btc/address',
  },
  {
    id: 'ETH',
    name: 'Ethereum',
    short: 'ETH',
    icon: <Ethereum />,
    loan_to_value: 50,
    interest_rate: 15,
    url: 'https://etherscan.io/address',
  },
  {
    id: 'SOL',
    name: 'Solana',
    short: 'SOL',
    icon: <Solana />,
    loan_to_value: 50,
    interest_rate: 15,
    url: 'https://explorer.solana.com/address',
  },
  {
    id: 'USDC',
    name: 'USD Coin',
    short: 'USDC',
    icon: <Usdcoin />,
    loan_to_value: 70,
    interest_rate: 15,
    url: 'https://etherscan.io/address',
  },
];
