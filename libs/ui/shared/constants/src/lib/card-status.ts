import { theme } from '@archie/ui/shared/theme';

export enum CardStatus {
  ACTIVE = 'active',
  FROZEN = 'frozen',
}

export const CardStatusText = {
  [CardStatus.ACTIVE]: 'Active',
  [CardStatus.FROZEN]: 'Frozen',
};

export const CardStatusColor = {
  [CardStatus.ACTIVE]: theme.textSuccess,
  [CardStatus.FROZEN]: theme.textSecondary,
};
