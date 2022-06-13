import { ReactElement } from 'react';
import { Wallet } from '../components/_generic/icons/wallet';
import { BitcoinOutline } from '../components/_generic/icons/bitcoin-outline';
import { Paper } from '../components/_generic/icons/paper';
import { Settings } from '../components/_generic/icons/settings';
import { Logout } from '../components/_generic/icons/logout';

export interface DashboardNavItem {
  icon: ReactElement;
  name: string;
  path: string;
}

export const dashboardNavItems: DashboardNavItem[] = [
  {
    icon: <Wallet />,
    name: 'Wallet & Collateral',
    path: '/wallet-and-collateral',
  },
  {
    icon: <BitcoinOutline />,
    name: 'Rewards',
    path: '/rewards',
  },
  {
    icon: <Paper />,
    name: 'History',
    path: '/history',
  },
  {
    icon: <Settings />,
    name: 'Settings',
    path: '/settings',
  },
  {
    icon: <Logout />,
    name: 'Logout',
    path: '/logout',
  },
];
