import { FC } from 'react';

import { CardStatus, CardStatusText } from '@archie-webapps/shared/constants';
import { ParagraphXXS } from '@archie-webapps/shared/ui/design-system';

import { StatusBadgeStyled } from './status-badge.styled';

export interface StatusBadgeProps {
  status: CardStatus;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status }) => (
  <StatusBadgeStyled status={status}>
    <ParagraphXXS weight={800}>{CardStatusText[status]}</ParagraphXXS>
  </StatusBadgeStyled>
);
