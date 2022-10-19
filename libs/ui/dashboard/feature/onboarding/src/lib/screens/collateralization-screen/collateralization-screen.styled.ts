import styled from 'styled-components';

import { breakpoints } from '@archie/ui/shared/ui/theme';

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
    display: flex;
    justify-content: flex-start;
    color: ${({ theme }) => theme.textDisabled};
    background-color: ${({ theme }) => theme.backgroundPrimary};
    height: 10%;
    width: 100%;
  }

  .address-placeholder {
    width: 100%;
    height: 508px;
    background-color: ${({ theme }) => theme.backgroundSecondary};
    border-top: 1px solid ${({ theme }) => theme.borderPrimary};
    border-bottom: 1px solid ${({ theme }) => theme.borderPrimary};
  }
`;
