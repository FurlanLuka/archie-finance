import styled from 'styled-components';

import { NextPaymentChartStyled } from '@archie-webapps/archie-dashboard/components';
import { breakpoints, NAV_WIDTH, NAV_WIDTH_TABLET } from '@archie-webapps/shared/ui/theme';


export const PaymentScreenStyled = styled.div`
  width: 100%;
  max-width: calc(1000px + 4rem);
  display: flex;
  flex-direction: column;
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
    margin-bottom: 1.5rem;
  }

  .section-cards {
    display: flex;
    gap: 2rem;
    margin-bottom: 1.5rem;

    @media (max-width: ${breakpoints.screenMD}) {
      flex-wrap: wrap;
      max-width: 70%;
    }

    @media (max-width: ${breakpoints.screenSM}) {
      max-width: 100%;
    }
  }

  .cards-group {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    width: 100%;
    max-width: 350px;

    @media (max-width: ${breakpoints.screenMD}) {
      max-width: 70%;
    }

    @media (max-width: ${breakpoints.screenSM}) {
      max-width: 100%;
    }

    .card-title, 
    .card-info {
      margin-bottom: 0;
    }
  }

  ${NextPaymentChartStyled} {
    margin-top: 0.75rem;
  }

  .section-actions {
    display: flex;
    gap: 2rem;
    margin-bottom: 2.5rem;
  }
`;
