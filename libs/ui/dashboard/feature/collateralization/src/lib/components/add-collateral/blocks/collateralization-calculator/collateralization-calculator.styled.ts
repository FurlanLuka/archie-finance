import styled, { keyframes } from 'styled-components';

import { breakpoints } from '@archie/ui/shared/theme';

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

export const CollateralizationCalculatorStyled = styled.div`
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
    width: 33.33%;
    padding-right: 0.5rem;

    @media (max-width: ${breakpoints.screenMD}) {
      width: 36%;
    }

    @media (max-width: ${breakpoints.screenSM}) {
      width: 100%;
      margin-bottom: 1rem;
    }

    :nth-child(2) {
      max-width: 186px;
    }

    :nth-child(3) {
      max-width: 96px;
    }

    h4 {
      white-space: nowrap;

      @media (max-width: ${breakpoints.screenMD}) {
        white-space: normal;
      }
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
      animation: ${fadeOut} 0.4s ease-out 2s forwards,
        ${hide} 0s linear 2s forwards;
    }
  }

  .data {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`;
