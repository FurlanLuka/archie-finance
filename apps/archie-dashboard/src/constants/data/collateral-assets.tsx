import { ReactElement } from 'react';

import { Icon } from '@archie-webapps/ui-icons';

export interface CollateralAsset {
  // TODO icon to string
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
    icon: <Icon name="bitcoin" />,
    loan_to_value: 50,
    interest_rate: 15,
    url: 'https://www.blockchain.com/btc/address',
  },
  {
    id: 'ETH',
    name: 'Ethereum',
    short: 'ETH',
    icon: <Icon name="ethereum" />,
    loan_to_value: 50,
    interest_rate: 15,
    url: 'https://etherscan.io/address',
  },
  {
    id: 'SOL',
    name: 'Solana',
    short: 'SOL',
    icon: <Icon name="solana" />,
    loan_to_value: 50,
    interest_rate: 15,
    url: 'https://explorer.solana.com/address',
  },
  {
    id: 'USDC',
    name: 'USD Coin',
    short: 'USDC',
    icon: <Icon name="usdcoin" />,
    loan_to_value: 70,
    interest_rate: 15,
    url: 'https://etherscan.io/address',
  },
];
