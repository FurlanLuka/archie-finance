import styled from 'styled-components';

import { NextPaymentChartStyled } from '@archie/ui/dashboard/components';
import { breakpoints } from '@archie/ui/shared/ui/theme';

export const PaymentScreenStyled = styled.div`
  width: 100%;
  max-width: calc(1000px + 4rem);
  display: flex;
  flex-direction: column;
  padding: 3rem 2rem;

  @media (max-width: ${breakpoints.screenSM}) {
    padding: 1.5rem 1rem;
  }

  .title {
    margin-bottom: 1.5rem;
  }

  .section-cards {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1.5fr 1fr;
    grid-auto-rows: 264px;
    margin-bottom: 1.5rem;

    @media (max-width: ${breakpoints.screenMD}) {
      grid-template-columns: repeat(auto-fill, 70%);
      grid-auto-rows: 264px 1fr;
    }

    @media (max-width: ${breakpoints.screenSM}) {
      grid-template-columns: 100%;
      grid-auto-rows: 448px 1fr;
    }
  }

  .cards-group {
    display: grid;
    gap: 1rem;
    grid-auto-rows: 140px 108px;

    @media (max-width: ${breakpoints.screenMD}) {
      gap: 2rem;
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
