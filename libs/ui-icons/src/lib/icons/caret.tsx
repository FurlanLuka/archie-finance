import { FC } from 'react';
import { theme } from '@archie-webapps/ui-theme';

import { iconProps } from './icons.interface';

const Caret: FC<iconProps> = ({ fill = theme.textPrimary, className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M7.41 8.58984L12 13.1698L16.59 8.58984L18 9.99984L12 15.9998L6 9.99984L7.41 8.58984Z" fill={fill} />
  </svg>
);

export default Caret;
