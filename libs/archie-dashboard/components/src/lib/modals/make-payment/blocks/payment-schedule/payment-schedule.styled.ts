import styled from 'styled-components';

export const PaymentScheduleModalStyled = styled.div`
  display: flex;
  flex-direction: column;

  .title {
    border-bottom: 1px solid ${({ theme }) => theme.borderDark};
    padding-bottom: 1rem;
    margin-bottom: 1.5rem;
  }

  .subtitle {
    margin-bottom: 0.5rem;
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
    min-height: 28px;
    white-space: nowrap;
    margin-bottom: 0.25rem;

    label,
    input {
      width: 120px;
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

  .btn-group {
    margin-top: 4rem;
  }
`;
