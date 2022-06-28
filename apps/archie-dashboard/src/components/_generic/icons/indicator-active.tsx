import { FC } from 'react';
import { theme } from '@archie-webapps/ui-theme';

import { iconProps } from './icons.interface';

export const IndicatorActive: FC<iconProps> = ({ fill = theme.textHighlight, className = 'active' }) => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="1" y="1" width="32" height="32" rx="16" stroke={fill} />
    <rect x="5.5" y="5.5" width="23" height="23" rx="11.5" fill={fill} stroke={fill} />
    <path
      d="M18.1051 11.3636L17.9176 19.5795H16.0881L15.9062 11.3636H18.1051ZM17.0028 23.125C16.6581 23.125 16.3627 23.0038 16.1165 22.7614C15.8741 22.5189 15.7528 22.2235 15.7528 21.875C15.7528 21.5341 15.8741 21.2424 16.1165 21C16.3627 20.7576 16.6581 20.6364 17.0028 20.6364C17.34 20.6364 17.6316 20.7576 17.8778 21C18.1278 21.2424 18.2528 21.5341 18.2528 21.875C18.2528 22.1061 18.1941 22.3163 18.0767 22.5057C17.9631 22.6951 17.8116 22.8466 17.6222 22.9602C17.4366 23.0701 17.2301 23.125 17.0028 23.125Z"
      fill="white"
    />
  </svg>
);
