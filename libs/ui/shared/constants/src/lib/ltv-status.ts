import { theme } from '@archie/ui/shared/theme';

export enum LTVStatus {
  GOOD = 'good',
  OK = 'ok',
  WARNING = 'warning',
  MARGIN_CALL = 'margin_call',
}

export const LTVText = {
  [LTVStatus.GOOD]: 'Good',
  [LTVStatus.OK]: 'Ok',
  [LTVStatus.WARNING]: 'Warning',
  [LTVStatus.MARGIN_CALL]: 'Margin Call',
};

export const LTVColor = {
  [LTVStatus.GOOD]: theme.textSuccess,
  [LTVStatus.OK]: theme.textWarning,
  [LTVStatus.WARNING]: theme.textWarning,
  [LTVStatus.MARGIN_CALL]: theme.textDanger,
};
