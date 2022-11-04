import styled from 'styled-components';

import { breakpoints } from '@archie/ui/shared/theme';

export const PaymentConfirmStyled = styled.div`
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
    margin-bottom: 2rem;
  }

  .btn-group {
    display: flex;
    gap: 0.5rem;
    max-width: 70%;
    margin-top: 4rem;

    @media (max-width: ${breakpoints.screenSM}) {
      max-width: 100%;
    }
  }
`;
