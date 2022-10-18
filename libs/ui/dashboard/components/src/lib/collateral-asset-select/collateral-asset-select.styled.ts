import styled from 'styled-components';

import { breakpoints } from '@archie-microservices/ui/shared/ui/theme';

export const CollateralAssetStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;

  .select-label {
    margin-bottom: 0.75rem;
  }

  .collateral-deposit {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    padding: 0.6rem 1rem;
    border-bottom: 1px solid ${({ theme }) => theme.borderPrimary};
    cursor: pointer;

    :last-child {
      border-bottom: 0;
    }

    @media (max-width: ${breakpoints.screenSM}) {
      padding: 0.6rem 0.5rem;
    }
  }
`;
