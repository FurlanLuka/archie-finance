import styled from 'styled-components';

import { breakpoints } from '@archie-webapps/shared/ui/theme';

export const CollateralStyled = styled.div`
  width: 100%;
  max-width: calc(1000px + 4rem);
  padding: 3rem 2rem;

  @media (max-width: ${breakpoints.screenSM}) {
    padding: 1.5rem 1rem;
  }

  .title {
    margin-bottom: 1.5rem;
  }

  .subtitle-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .subtitle {
    margin-bottom: 0.5rem;
  }

  .total {
    margin-bottom: 0.5rem;
  }

  .ltv {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .ltv-group {
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;

    h6 {
      line-height: 1.16;
    }
  }
`;
