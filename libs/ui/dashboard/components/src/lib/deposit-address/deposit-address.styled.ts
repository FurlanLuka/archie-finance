import styled from 'styled-components';

import { breakpoints } from '@archie/ui/shared/ui/theme';
import { QR_CODE } from '@archie/ui/shared/ui/theme';

export const DepositAddressStyled = styled.div<{ showTerms?: boolean }>`
  position: relative;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  border-top: 1px solid ${({ theme }) => theme.borderPrimary};
  border-bottom: 1px solid ${({ theme }) => theme.borderPrimary};
  width: 100%;
  min-height: ${({ showTerms }) => (showTerms ? '470px' : '276px')};
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
      cursor: pointer;

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
