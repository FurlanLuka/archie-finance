import styled from 'styled-components';

import { breakpoints } from '@archie-webapps/ui-theme';

export const CollateralReceivedAlertStyled = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.backgroundPositive};
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.08);
  border: 0;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 928px;
  padding: 0.75rem 3rem;
  margin-bottom: 1.5rem;

  @media (max-width: ${breakpoints.screenSM}) {
    padding: 0.75rem 1rem;
  }

  .image {
    max-width: 52px;
    margin-right: 2.5rem;

    @media (max-width: ${breakpoints.screenSM}) {
      margin-right: 1.5rem;
    }
  }

  button {
    margin-top: 0.5rem;
  }
`;
