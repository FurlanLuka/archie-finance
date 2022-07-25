import { IconName } from '@archie-webapps/shared/ui/icons';

interface DashboardNavItem {
  icon: IconName;
  name: string;
  path: string;
}

export const dashboardNavItems: DashboardNavItem[] = [
  {
    icon: 'wallet',
    name: 'Wallet & Collateral',
    path: '/',
  },
  {
    icon: 'bitcoin-outline',
    name: 'Rewards',
    path: '/rewards',
  },
  {
    icon: 'paper',
    name: 'History',
    path: '/history',
  },
  {
    icon: 'settings',
    name: 'Settings',
    path: '/settings',
  },
  {
    icon: 'logout',
    name: 'Logout',
    path: '/logout',
  },
];
