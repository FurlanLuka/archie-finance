import { breakpoints } from '@archie-webapps/shared/ui/theme';
import styled, { keyframes } from 'styled-components';

const scale = keyframes`
  0% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
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

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

export const DepositAddressStyled = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-top: 1px solid ${({ theme }) => theme.borderPrimary};
  border-bottom: 1px solid ${({ theme }) => theme.borderPrimary};
  width: 100%;
  min-height: 470px;
  padding: 1.5rem 1rem;

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
  
  .copied {
    transform-origin: center;
    animation: ${scale} 0.2s ease forwards;
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

  .info-link-url {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.textHighlight};

    margin-top: 0.05rem;
  }

  .info-link {
    display: flex;
    gap: 0.25rem;

    @media (max-width: ${breakpoints.screenSM}) {
      flex-direction: column;
      gap: 0;
    }
  }

  .info-link-icon {
    margin-left: 0.25rem;
  }

  .divider {
    height: 1px;
    width: 100%;
    background-color: ${({ theme }) => theme.borderPrimary};
    border: 0;
    margin: 1rem 0 1.5rem;
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
