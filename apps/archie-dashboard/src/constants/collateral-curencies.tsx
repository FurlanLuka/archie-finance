import { ReactElement } from 'react';
import { Bitcoin } from '../components/_generic/icons/bitcoin';
import { Ethereum } from '../components/_generic/icons/ethereum';
import { Solana } from '../components/_generic/icons/solana';
import { Usdcoin } from '../components/_generic/icons/usdcoin';

export interface CollateralCurrency {
  id: string;
  name: string;
  short: string;
  icon: ReactElement;
  loan_to_value: string;
  interest_rate: string;
  url: string;
}

export const collateralCurrencies: CollateralCurrency[] = [
  {
    id: 'BTC',
    name: 'Bitcoin',
    short: 'BTC',
    icon: <Bitcoin />,
    loan_to_value: '50%',
    interest_rate: '15%',
    url: 'https://www.blockchain.com/btc/address',
  },
  {
    id: 'ETH',
    name: 'Ethereum',
    short: 'ETH',
    icon: <Ethereum />,
    loan_to_value: '50%',
    interest_rate: '15%',
    url: 'https://etherscan.io/address',
  },
  {
    id: 'SOL',
    name: 'Solana',
    short: 'SOL',
    icon: <Solana />,
    loan_to_value: '50%',
    interest_rate: '15%',
    url: 'https://explorer.solana.com/address',
  },
  {
    id: 'USDC',
    name: 'USD Coin',
    short: 'USDC',
    icon: <Usdcoin />,
    loan_to_value: '50%',
    interest_rate: '15%',
    url: 'https://etherscan.io/address',
  },
];
