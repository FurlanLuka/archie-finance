import styled, { keyframes } from 'styled-components';

import { breakpoints, QR_CODE } from '@archie-webapps/shared/ui/theme';

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const hide = keyframes`
  0% {
    visibility: visible;
  }
  100% {
    visibility: hidden;
  }
`;

export const CollateralizationScreenStyled = styled.div`
  width: 100%;
  max-width: 928px;

  .title {
    margin-bottom: 0.5rem;
    text-align: center;
  }

  .subtitle {
    margin-bottom: 3.5rem;
    text-align: center;
  }

  .inputs {
    display: flex;
    gap: 2rem;
    width: 100%;
    margin-bottom: 4rem;

    @media (max-width: ${breakpoints.screenMD}) {
      flex-direction: column;
    }
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

  .address {
    position: relative;
    background-color: ${({ theme }) => theme.backgroundSecondary};
    border-top: 1px solid ${({ theme }) => theme.borderPrimary};
    border-bottom: 1px solid ${({ theme }) => theme.borderPrimary};
    width: 100%;
    min-height: 470px;
    padding: 1.5rem 1rem;
  }

  .data {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .address-copy {
    position: relative;
    display: flex;
    align-items: center;
    background-color: ${({ theme }) => theme.backgroundPrimary};
    border-radius: 0.25rem;
    width: 100%;
    padding: 0.5rem 1rem;
    margin: 0.5rem 0 1.5rem;

    p {
      max-width: 85%;

      @media (max-width: ${breakpoints.screenXS}) {
        max-width: 12rem;
      }
    }
  }

  .btn-copy {
    position: absolute;
    right: 1rem;
    background-color: transparent;
    border: 0;
    padding: 0;
    cursor: pointer;
  }

  .address-code {
    display: flex;

    @media (max-width: ${breakpoints.screenSM}) {
      flex-direction: column;
    }

    svg {
      min-width: ${QR_CODE}px;
    }
  }

  .info {
    margin-left: 2rem;

    @media (max-width: ${breakpoints.screenSM}) {
      margin-left: 0;
      margin-top: 1rem;
    }
  }

  .info-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 1.5rem;
  }

  .divider {
    height: 1px;
    width: 100%;
    background-color: ${({ theme }) => theme.borderPrimary};
    border: 0;
    margin: 1rem 0 1.5rem;
  }

  .info-link {
    display: flex;
    gap: 0.25rem;

    @media (max-width: ${breakpoints.screenSM}) {
      flex-direction: column;
      gap: 0;
    }
  }

  .info-link-url {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.textHighlight};

    margin-top: 0.05rem;
  }

  .info-link-icon {
    margin-left: 0.25rem;
  }

  .terms {
    display: flex;

    @media (max-width: ${breakpoints.screenSM}) {
      flex-direction: column;
    }
  }

  .terms-title {
    display: flex;
    justify-content: flex-start;
    width: 30%;

    @media (max-width: ${breakpoints.screenSM}) {
      width: 100%;
      margin-bottom: 0.5rem;
    }
  }

  .terms-list {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 70%;
    margin: 0;

    @media (max-width: ${breakpoints.screenSM}) {
      width: 100%;
      padding-left: 1rem;
    }
  }

  .terms-list-item {
    margin-bottom: 1rem;
    text-align: left;
  }
`;
