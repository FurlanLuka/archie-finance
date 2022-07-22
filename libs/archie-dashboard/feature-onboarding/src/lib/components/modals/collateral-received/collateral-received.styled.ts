import styled from 'styled-components';

import { breakpoints } from '@archie-webapps/shared/ui-theme';

export const CollateralReceivedModalStyled = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: ${breakpoints.screenSM}) {
    flex-direction: column;
    gap: 0.5rem;
  }

  .image {
    width: 14%;
    padding-right: 1rem;

    @media (max-width: ${breakpoints.screenSM}) {
      width: 25%;
      padding-right: 0;
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 86%;

    @media (max-width: ${breakpoints.screenSM}) {
      width: 100%;
    }
  }

  .btn-group {
    display: flex;
    gap: 1rem;

    @media (max-width: ${breakpoints.screenSM}) {
      flex-direction: column;

      button {
        max-width: 100%;
      }
    }
  }
`;
