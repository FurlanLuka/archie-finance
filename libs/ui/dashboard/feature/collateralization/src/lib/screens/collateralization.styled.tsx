import styled from 'styled-components';

import { breakpoints } from '@archie/ui/shared/theme';

export const CollateralizationStyled = styled.div`
  width: 100%;
  max-width: calc(1000px + 4rem);
  padding: 3rem 2rem;

  @media (max-width: ${breakpoints.screenSM}) {
    padding: 1.5rem 1rem;
  }

  .title {
    margin-bottom: 1rem;
  }

  .subtitle-asset {
    text-align: center;
    margin-bottom: 3rem;
  }

  .subtitle-credit {
    text-align: center;
    max-width: 530px;
    margin-bottom: 1rem;
  }

  .subtitle-margin-call {
    text-align: center;
    max-width: 530px;
    margin-bottom: 3rem;
  }

  .cancel-btn {
    margin-top: 1rem;
  }
`;
