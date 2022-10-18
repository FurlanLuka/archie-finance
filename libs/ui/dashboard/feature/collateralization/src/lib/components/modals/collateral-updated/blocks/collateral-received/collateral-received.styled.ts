import styled from 'styled-components';

import { breakpoints } from '@archie-webapps/shared/ui/theme';

export const CollateralReceivedStyled = styled.div`
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
    align-items: flex-start;
    width: 86%;

    @media (max-width: ${breakpoints.screenSM}) {
      width: 100%;
    }
  }

  .modal-title {
    margin-bottom: 0.5rem;
  }

  .modal-text {
    margin-bottom: 1rem;
  }

  button {
    @media (max-width: ${breakpoints.screenSM}) {
      max-width: 100%;
    }
  }
`;
