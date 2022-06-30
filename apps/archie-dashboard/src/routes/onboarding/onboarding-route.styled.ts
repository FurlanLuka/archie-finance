import styled from 'styled-components';

import { breakpoints } from '@archie-webapps/ui-theme';

export const OnboardingStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  padding: 2rem 1rem;

  @media (max-width: ${breakpoints.screenSM}) {
    padding: 1.5rem 1rem;
  }
`;
