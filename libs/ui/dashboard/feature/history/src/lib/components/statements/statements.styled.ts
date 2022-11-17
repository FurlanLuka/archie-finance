import styled from 'styled-components';

import { breakpoints } from '@archie/ui/shared/theme';

export const StatementsStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: ${breakpoints.screenMD}) {
    flex-direction: column;
    align-items: flex-end;
  }

  @media (max-width: ${breakpoints.screenSM}) {
    align-items: flex-start;
  }
`;
