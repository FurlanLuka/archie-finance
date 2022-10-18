import { FC } from 'react';

import {
  CardStatus,
  CardStatusText,
} from '@archie-microservices/ui/shared/constants';
import { BodyS } from '@archie-webapps/shared/ui/design-system';

import { StatusBadgeStyled } from './status-badge.styled';

export interface StatusBadgeProps {
  status: CardStatus;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status }) => (
  <StatusBadgeStyled status={status}>
    <BodyS weight={800}>{CardStatusText[status]}</BodyS>
  </StatusBadgeStyled>
);
