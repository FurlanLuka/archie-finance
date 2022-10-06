import styled from 'styled-components';

import { breakpoints } from '@archie-webapps/shared/ui/theme';

export const HistoryStyled = styled.div`
  width: 100%;
  max-width: calc(1000px + 4rem);
  padding: 3rem 2rem;

  @media (max-width: ${breakpoints.screenSM}) {
    padding: 1.5rem 1rem;
  }

  .title-group {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 2.5rem;
  }

  .load-btn {
    margin-top: 1.5rem;
  }
`;
