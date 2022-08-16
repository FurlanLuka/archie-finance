import styled from 'styled-components';

import { breakpoints } from '@archie-webapps/shared/ui/theme';

export const PaymentConfirmModalStyled = styled.div`
  display: flex;
  flex-direction: column;

  .title {
    border-bottom: 1px solid ${({ theme }) => theme.borderDark};
    padding-bottom: 1rem;
    margin-bottom: 1.5rem;
  }

  .divider {
    background-color: ${({ theme }) => theme.borderPrimary};
    width: 100%;
    height: 1px;
    margin: 3rem 0 1.5rem;
  }

  .balance-note {
    margin-bottom: 0.5rem;
  }

  .balance-value {
    margin-bottom: 1.5rem;
  }

  .btn-group {
    display: flex;
    gap: 1rem;
    max-width: 70%;
    margin-top: 4rem;

    @media (max-width: ${breakpoints.screenSM}) {
      max-width: 100%;
    }
  }
`;
