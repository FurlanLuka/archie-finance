import { FC } from 'react';

import { CardStatus } from '@archie/api/credit-api/data-transfer-objects/types';
import { CardStatusText } from '@archie/ui/shared/constants';
import { BodyS } from '@archie/ui/shared/design-system';

import { StatusBadgeStyled } from './status-badge.styled';

export interface StatusBadgeProps {
  status: CardStatus;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status }) => (
  <StatusBadgeStyled status={status}>
    <BodyS weight={800}>{CardStatusText[status]}</BodyS>
  </StatusBadgeStyled>
);
