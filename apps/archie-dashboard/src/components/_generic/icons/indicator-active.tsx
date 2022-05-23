import { FC } from 'react';

import { colors } from '../../../constants/theme';

import { iconProps } from './icons.interface';

export const IndicatorActive: FC<iconProps> = ({ fill = colors.coral, className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="0.5" y="0.5" width="23" height="23" rx="11.5" fill={fill} stroke={fill} />
    <path
      d="M13.1051 6.36364L12.9176 14.5795H11.0881L10.9062 6.36364H13.1051ZM12.0028 18.125C11.6581 18.125 11.3627 18.0038 11.1165 17.7614C10.8741 17.5189 10.7528 17.2235 10.7528 16.875C10.7528 16.5341 10.8741 16.2424 11.1165 16C11.3627 15.7576 11.6581 15.6364 12.0028 15.6364C12.34 15.6364 12.6316 15.7576 12.8778 16C13.1278 16.2424 13.2528 16.5341 13.2528 16.875C13.2528 17.1061 13.1941 17.3163 13.0767 17.5057C12.9631 17.6951 12.8116 17.8466 12.6222 17.9602C12.4366 18.0701 12.2301 18.125 12.0028 18.125Z"
      fill="white"
    />
  </svg>
);
