import { FC } from 'react';

import {
  CardStatus,
  CardStatusText,
} from '@archie/ui/shared/constants';
import { BodyS } from '@archie/ui/shared/ui/design-system';

import { StatusBadgeStyled } from './status-badge.styled';

export interface StatusBadgeProps {
  status: CardStatus;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status }) => (
  <StatusBadgeStyled status={status}>
    <BodyS weight={800}>{CardStatusText[status]}</BodyS>
  </StatusBadgeStyled>
);