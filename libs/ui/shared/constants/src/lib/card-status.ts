import { CardStatus } from '@archie/api/credit-api/data-transfer-objects/types';
import { theme } from '@archie/ui/shared/theme';

export const CardStatusText = {
  [CardStatus.active]: 'Active',
  [CardStatus.frozen]: 'Frozen',
};

export const CardStatusColor = {
  [CardStatus.active]: theme.textSuccess,
  [CardStatus.frozen]: theme.textSecondary,
};
