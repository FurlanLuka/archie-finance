import { IconName } from '@archie/ui/shared/icons';

interface DashboardNavItem {
  icon: IconName;
  name: string;
  path: string;
  end?: boolean;
}

export const dashboardNavItems: DashboardNavItem[] = [
  {
    icon: 'home',
    name: 'Home',
    path: '',
    end: true,
  },
  {
    icon: 'wallet',
    name: 'Collateral',
    path: 'collateral',
  },
  // {
  //   icon: 'bitcoin-outline',
  //   name: 'Rewards',
  //   path: 'rewards',
  // },
  {
    icon: 'credit-card',
    name: 'Payment',
    path: 'payment',
  },
  {
    icon: 'paper',
    name: 'History',
    path: 'history',
  },
  {
    icon: 'settings',
    name: 'Settings',
    path: 'settings',
  },
  {
    icon: 'logout',
    name: 'Logout',
    path: 'logout',
  },
];
