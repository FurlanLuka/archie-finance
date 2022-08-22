import styled from 'styled-components';

import { breakpoints } from '@archie-webapps/shared/ui/theme';

export const ArchieCardStyled = styled.div`

  @media (max-width: ${breakpoints.screenSM}) {
    width: 100%;
  }  

  .archie-card {
    width: 420px;
    min-height: 264px;

    @media (max-width: ${breakpoints.screenSM}) {
      width: 360px;
      height: 220px;
      min-height: 220px;
    }
  }

  .card-data {
    position: absolute;
    top: 45%;
    left: 1.5rem;
    transform: translateY(-45%);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    letter-spacing: 0.15em;
  }

  .card-data-group {
    display: flex;
    gap: 1.5rem;

    span {
      font-size: 0.75rem;
      margin-right: 0.25rem;
    }
  }

  .card-status {
    position: absolute;
    /* Temp, just for Rize */
    top: 36px;
    /* Temp, just for Rize, it should take bottom instead */
    /* bottom: 1.25rem; */
    left: 0;
    transform: translateY(-10%);
    letter-spacing: 0.02em;
    text-transform: uppercase;
    background-color: ${({ theme }) => theme.backgroundSuccess};
    border-top-right-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    padding: 0.5rem 1.5rem;

    /* Temp, just for Rize */
    @media (max-width: ${breakpoints.screenSM}) {
      top: 28px;
    }  

    p {
      color: ${({ theme }) => theme.textLight};
    }
  }

  /* Temp, just for Rize */
  .number-overlay {
    position: absolute;
    left: 1rem;
    bottom: 96px;
    display: flex;
    align-items: center;
    font-size: 1.55rem;
    color: #393838;
    width: 200px;
    height: 2rem;
    background-color: #dce1e4;

    @media (max-width: ${breakpoints.screenSM}) {
      bottom: 78px;
      font-size: 1.35rem;
      width: 160px;
    }
  }

  .expiry-overlay {
    position: absolute;
    left: 2.4rem;
    bottom: 60px;
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    color: #727375;
    height: 2rem;
    background-color: #dce1e4;

    @media (max-width: ${breakpoints.screenSM}) {
      left: 2rem;
      bottom: 46px;
    }
  }

  .cvv-overlay {
    position: absolute;
    right: 9.4rem;
    bottom: 60px;
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    color: #727375;
    height: 2rem;
    background-color: #dce1e4;

    @media (max-width: ${breakpoints.screenSM}) {
      right: 7.8rem;
      bottom: 46px;
    }
  }
  /* Temp, just for Rize, use card-data and card-status instead */
`;
