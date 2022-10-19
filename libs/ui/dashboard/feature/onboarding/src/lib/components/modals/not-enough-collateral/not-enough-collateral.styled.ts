import styled from 'styled-components';

import { breakpoints } from '@archie/ui/shared/ui/theme';

export const NotEnoughCollateralModalStyled = styled.div`
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
    width: 86%;

    @media (max-width: ${breakpoints.screenSM}) {
      width: 100%;

      button {
        max-width: 100%;
      }
    }
  }

  .modal-title {
    margin-bottom: 0.5rem;
  }

  .modal-text {
    margin-bottom: 1.5rem;
  }
`;
