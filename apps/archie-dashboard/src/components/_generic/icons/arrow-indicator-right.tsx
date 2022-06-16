import { FC } from 'react';

import { theme } from '../../../constants/ui/theme';

import { iconProps } from './icons.interface';

export const ArrowIndicatorRight: FC<iconProps> = ({ fill = theme.textPrimary, className }) => (
  <svg width="97" height="8" viewBox="0 0 97 8" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M96.3535 4.35355C96.5488 4.15829 96.5488 3.84171 96.3535 3.64645L93.1716 0.464466C92.9763 0.269204 92.6597 0.269204 92.4645 0.464466C92.2692 0.659728 92.2692 0.976311 92.4645 1.17157L95.2929 4L92.4645 6.82843C92.2692 7.02369 92.2692 7.34027 92.4645 7.53553C92.6597 7.7308 92.9763 7.7308 93.1716 7.53553L96.3535 4.35355ZM0 4.5H96V3.5H0V4.5Z"
      fill={fill}
    />
  </svg>
);
