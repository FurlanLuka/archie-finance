import styled from 'styled-components';

import {
  CardStatus,
  CardStatusColor,
} from '@archie-microservices/ui/shared/constants';
import { breakpoints } from '@archie-webapps/shared/ui/theme';

export interface StatusBadgeStyledProps {
  status: CardStatus;
}

export const StatusBadgeStyled = styled.div<StatusBadgeStyledProps>`
  position: absolute;
  /* Temp, just for Rize */
  top: 36px;
  /* Temp, just for Rize, it should take bottom instead */
  /* bottom: 1.25rem; */
  left: 0;
  transform: translateY(-10%);
  letter-spacing: 0.02em;
  text-transform: uppercase;
  background-color: ${({ status }) => CardStatusColor[status]};
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  padding: 0.5rem 1.5rem;

  /* Temp, just for Rize */
  @media (max-width: ${breakpoints.screenSM}) {
    top: 28px;
  }

  p {
    color: ${({ theme }) => theme.textLight};
  }
`;
