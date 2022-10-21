import styled from 'styled-components';

export const PaymentScheduleFormStyled = styled.div`
  display: flex;
  flex-direction: column;

  .subtitle {
    margin-bottom: 0.5rem;
  }

  .divider {
    background-color: ${({ theme }) => theme.borderPrimary};
    width: 100%;
    height: 1px;
    margin: 1.5rem 0;
  }

  .payment-date {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    white-space: nowrap;
    margin-bottom: 0.5rem;

    label,
    input {
      width: fit-content;
      margin: 0;
    }
  }

  .btn-schedule {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: ${({ theme }) => theme.textHighlight};
    background-color: transparent;
    border: 0;
    padding: 0;
    cursor: pointer;
  }

  .radio-group {
    margin-top: 0.5rem;
  }

  .disabled {
    color: ${({ theme }) => theme.textDisabled};
  }

  .input-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;
    max-width: 330px;

    label,
    input {
      margin: 0;
    }
  }

  .amount {
    width: 120px;
  }

  .btn-group {
    margin-top: 4rem;
  }
`;
