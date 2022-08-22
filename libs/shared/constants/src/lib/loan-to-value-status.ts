import { theme } from '@archie-webapps/shared/ui/theme';

export enum LoanToValueStatus {
  GOOD = 'good',
  OK = 'ok',
  WARNING = 'warning',
  MARGIN_CALL = 'margin_call',
}

export const LoanToValueText = {
  [LoanToValueStatus.GOOD]: 'Good',
  [LoanToValueStatus.OK]: 'Ok',
  [LoanToValueStatus.WARNING]: 'Warning',
  [LoanToValueStatus.MARGIN_CALL]: 'Margin Call',
};

export const LoanToValueColor = {
  [LoanToValueStatus.GOOD]: theme.textSuccess,
  [LoanToValueStatus.OK]: theme.textWarning,
  [LoanToValueStatus.WARNING]: theme.textWarning,
  [LoanToValueStatus.MARGIN_CALL]: theme.textDanger,
};
