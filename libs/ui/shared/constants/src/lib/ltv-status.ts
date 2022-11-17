import { LtvStatus } from '@archie/api/ltv-api/data-transfer-objects/types';
import { theme } from '@archie/ui/shared/theme';

export const LTVText = {
  [LtvStatus.good]: 'Good',
  [LtvStatus.ok]: 'Ok',
  [LtvStatus.warning]: 'Warning',
  [LtvStatus.margin_call]: 'Margin Call',
};

export const LTVColor = {
  [LtvStatus.good]: theme.textSuccess,
  [LtvStatus.ok]: theme.textWarning,
  [LtvStatus.warning]: theme.textWarning,
  [LtvStatus.margin_call]: theme.textDanger,
};
