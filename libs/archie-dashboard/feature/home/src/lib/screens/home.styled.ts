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

  .title {
    margin-bottom: 0.5rem;
  }

  .subtitle {
    letter-spacing: 0.02em;
    margin-bottom: 1.5rem;
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

  /* Move it to design system */
  .skeleton {
    position: absolute;
    /* background-color: ${({ theme }) => theme.backgroundSecondary}; */
    height: 100%;
    width: 100%;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      transform: translateX(-100%);
      background: linear-gradient(to right, #fff 8%, #ececec 38%, #fff 54%);
      animation: ${load} 1s linear infinite;
    }
  }
`;
