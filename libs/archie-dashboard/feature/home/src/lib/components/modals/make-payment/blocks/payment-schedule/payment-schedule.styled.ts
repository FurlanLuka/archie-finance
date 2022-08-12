import styled from 'styled-components';

import { breakpoints } from '@archie-webapps/shared/ui/theme';

export const PaymentScheduleModalStyled = styled.div`
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
    margin: 2rem 0 1.5rem;
  }

  .payment-date {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .btn-schedule {
    font-size: 0.75rem;
    font-weight: 700;
    color: ${({ theme }) => theme.textHighlight};
    background-color: transparent;
    border: 0;
    padding: 0;
  }

  .radio-auto-payments {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    input {
      margin: 0;
      border: 2px solid ${({ theme }) => theme.textSecondary};
    }
  }

  .radio-group {
    margin-top: 0.5rem;
  }

  .btn-group {
    margin-top: 4rem;
  }
`;

// Move it to design system
export const InputRadio = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-left: 2rem;
  margin-bottom: 0.75rem;
  cursor: pointer;

  input {
    position: absolute;
    left: 0;
    height: 1.5rem;
    width: 1.5rem;
    /* opacity: 0; */
    margin: 0;
    cursor: pointer;

    &:before {
      position: ;
    }
  }
`
