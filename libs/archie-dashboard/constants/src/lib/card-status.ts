import { theme } from '@archie-webapps/shared/ui/theme';

export enum CardStatus {
  ACTIVE = 'active',
  FROZEN = 'frozen',
  WARING = 'warning',
  MARGIN_CALL = 'margin_call',
}

export const CardStatusText = {
  [CardStatus.ACTIVE]: 'Active',
  [CardStatus.FROZEN]: 'Frozen',
  [CardStatus.WARING]: 'Warning',
  [CardStatus.MARGIN_CALL]: 'Margin Call',
};

export const CardStatusColor = {
  [CardStatus.ACTIVE]: theme.textSuccess,
  [CardStatus.FROZEN]: theme.textSecondary,
  [CardStatus.WARING]: theme.textWarning,
  [CardStatus.MARGIN_CALL]: theme.textDanger,
};
