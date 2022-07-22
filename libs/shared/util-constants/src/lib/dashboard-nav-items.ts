import { IconName } from '@archie-webapps/shared/ui-icons';

// TODO check why we need babelrc here and in ui-theme
interface DashboardNavItem {
  icon: IconName;
  name: string;
  path: string;
}

// TODO figure out what to do with header, because this isn't shared across many apps
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
