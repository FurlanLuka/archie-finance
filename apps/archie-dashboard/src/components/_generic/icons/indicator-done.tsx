import { FC } from 'react';

import { theme } from '../../../constants/ui/theme';

import { iconProps } from './icons.interface';

export const IndicatorDone: FC<iconProps> = ({ fill = theme.textPositive, className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="0.5" y="0.5" width="23" height="23" rx="11.5" fill={fill} stroke={fill} />
    <path
      d="M6.5554 12.9943L7.90767 11.625L10.6634 14.3352L16.6236 8.39773L17.9872 9.76705L10.6634 17.0625L6.5554 12.9943Z"
      fill="white"
    />
  </svg>
);
