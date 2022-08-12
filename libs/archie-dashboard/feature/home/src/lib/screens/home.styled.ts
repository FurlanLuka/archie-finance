import styled, { keyframes } from 'styled-components';

import { breakpoints, NAV_WIDTH, NAV_WIDTH_TABLET } from '@archie-webapps/shared/ui/theme';

const load = keyframes`
  100% {
    transform: translateX(100%);
  }
`;

export const HomeStyled = styled.div`
  width: 100%;
  max-width: calc(1000px + 4rem);
  margin-left: ${NAV_WIDTH};
  padding: 3rem 2rem;

  @media (max-width: ${breakpoints.screenLG}) {
    margin-left: ${NAV_WIDTH_TABLET};
  }

  @media (max-width: ${breakpoints.screenMD}) {
    margin: 0;
  }

  @media (max-width: ${breakpoints.screenSM}) {
    padding: 1.5rem 1rem;
  }

  .section-title {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-height: 68px;
    margin-bottom: 1.5rem;

    @media (max-width: ${breakpoints.screenSM}) {
        min-height: 58px;
    }
  }

  .subtitle {
    letter-spacing: 0.02em;
  }

  .section-cards {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;

    @media (max-width: ${breakpoints.screenMD}) {
      flex-wrap: wrap;
      max-width: 70%;
    }

    @media (max-width: ${breakpoints.screenSM}) {
      max-width: 100%;
    }
  }
`;
