import styled from 'styled-components';

import { breakpoints } from '@archie/ui/shared/theme';

export const HistoryStyled = styled.div`
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
    justify-content: space-between;
    width: 100%;
    margin-bottom: 2.5rem;

    @media (max-width: ${breakpoints.screenSM}) {
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
  }

  .load-btn {
    margin: 1.5rem auto 0;
  }
`;
