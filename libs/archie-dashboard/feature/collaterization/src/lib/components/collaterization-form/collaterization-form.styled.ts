import styled, { keyframes } from 'styled-components';

import { breakpoints } from '@archie-webapps/shared/ui/theme';

const hide = keyframes`
  0% {
    visibility: visible;
  }
  100% {
    visibility: hidden;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const scale = keyframes`
  0% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
`;

export const CollaterizationFormStyled = styled.div`
  width: 100%;
  max-width: 730px;

  .credit-slider {
    width: 100%;
    margin-bottom: 4rem;
  }

  .result {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 1.5rem;

    @media (max-width: ${breakpoints.screenSM}) {
      flex-direction: column;
    }
  }

  .result-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 33.33%;
    max-width: 9rem;

    @media (max-width: ${breakpoints.screenSM}) {
      width: 100%;
      margin-bottom: 1rem;
    }

    h4 {
      position: relative;
      white-space: nowrap;
    }

    p {
      margin-bottom: 0.5rem;
    }
  }

  .placeholder {
    position: absolute;
    top: -5%;
    display: flex;
    justify-content: flex-start;
    color: ${({ theme }) => theme.textDisabled};
    background-color: ${({ theme }) => theme.backgroundPrimary};
    height: 110%;
    width: 100%;

    &.fade-out {
      animation: ${fadeOut} 0.4s ease-out 2s forwards, ${hide} 0s linear 2s forwards;
    }
  }

  .copied {
    transform-origin: center;
    animation: ${scale} 0.2s ease forwards;
  }

  .data {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`;
