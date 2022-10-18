import styled from 'styled-components';

import { breakpoints } from '@archie-microservices/ui/shared/ui/theme';

export const RewardsStyled = styled.div`
  width: 100%;
  max-width: calc(1000px + 4rem);
  padding: 3rem 2rem;

  @media (max-width: ${breakpoints.screenSM}) {
    padding: 1.5rem 1rem;
  }

  .title {
    margin-bottom: 0.5rem;
  }
`;
