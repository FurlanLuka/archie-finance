import { BitcoinOutline, Logout, Paper, Settings, Wallet } from '@archie-webapps/ui-icons';
import { ReactElement } from 'react';

export interface DashboardNavItem {
  icon: ReactElement;
  name: string;
  path: string;
}

export const dashboardNavItems: DashboardNavItem[] = [
  {
    icon: <Wallet />,
    name: 'Wallet & Collateral',
    path: '/',
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
