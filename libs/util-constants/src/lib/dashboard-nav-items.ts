import { IconName } from '@archie-webapps/ui-icons';

// TODO check why we need babelrc here and in ui-theme
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
    icon: 'wallet',
    name: 'Collateral',
    path: '/collateral',
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
