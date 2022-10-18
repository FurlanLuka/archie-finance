import styled from 'styled-components';

import { breakpoints } from '@archie-microservices/ui/shared/ui/theme';

export const StatementsStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: ${breakpoints.screenSM}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;
