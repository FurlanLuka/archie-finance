import { IconName } from '@archie-microservices/ui/shared/ui/icons';

interface DashboardNavItem {
  icon: IconName;
  name: string;
  path: string;
}

export const dashboardNavItems: DashboardNavItem[] = [
  {
    icon: 'home',
    name: 'Home',
    path: '/',
  },
  {
    icon: 'wallet',
    name: 'Collateral',
    path: '/collateral',
  },
  // {
  //   icon: 'bitcoin-outline',
  //   name: 'Rewards',
  //   path: '/rewards',
  // },
  {
    icon: 'credit-card',
    name: 'Payment',
    path: '/payment',
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
