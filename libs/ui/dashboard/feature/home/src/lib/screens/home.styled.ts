import styled from 'styled-components';

import { NextPaymentChartStyled } from '@archie-microservices/ui/dashboard/components';
import { breakpoints } from '@archie-microservices/ui/shared/ui/theme';

export const HomeStyled = styled.div`
  width: 100%;
  max-width: calc(1000px + 4rem);
  padding: 3rem 2rem;

  @media (max-width: ${breakpoints.screenSM}) {
    padding: 1.5rem 1rem;
  }

  .section-title {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-height: 68px;
    margin-bottom: 1.5rem;

    @media (max-width: ${breakpoints.screenSM}) {
      min-height: 58px;
    }
  }

  .subtitle {
    letter-spacing: 0.02em;
  }

  .section-cards {
    display: grid;
    gap: 2rem;
    margin-bottom: 2rem;

    &.one {
      grid-template-columns: 420px 1fr;
      grid-auto-rows: 264px;

      @media (max-width: ${breakpoints.screenMD}) {
        grid-template-columns: repeat(auto-fill, 70%);
      }

      @media (max-width: ${breakpoints.screenSM}) {
        grid-template-columns: 100%;
        grid-auto-rows: 220px 448px;
      }
    }

    &.two {
      grid-template-columns: repeat(3, 1fr);
      grid-auto-rows: 184px;

      @media (max-width: ${breakpoints.screenMD}) {
        grid-template-columns: repeat(auto-fill, 70%);
      }

      @media (max-width: ${breakpoints.screenSM}) {
        grid-template-columns: 100%;
      }
    }
  }

  ${NextPaymentChartStyled} {
    margin-bottom: 0.75rem;
  }
`;
