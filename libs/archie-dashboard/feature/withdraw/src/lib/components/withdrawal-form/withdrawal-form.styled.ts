import styled from 'styled-components';

export const WithdrawalForm = styled.form`
  width: 100%;
  max-width: 730px;

  .error {
    margin-top: 0.25rem;
  }

  .credit-limit {
    font-style: italic;
    margin-top: 0.5rem;
  }

  .address {
    background-color: ${({ theme }) => theme.backgroundSecondary};
    border-radius: 0.25rem;
    width: 100%;
    margin: 4rem 0 5rem;
    padding: 1.5rem 1rem;
  }

  .address-title {
    border-bottom: 1px solid ${({ theme }) => theme.borderPrimary};
    padding-bottom: 1.5rem;
    margin-bottom: 2.5rem;
  }

  .address-input {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding-bottom: 1rem;

    input {
      border: 0;
      border-radius: 0.25rem;
      font-weight: 600;
      padding: 1rem 0.75rem;
    }
  }

  .btn-group {
    justify-content: center;
  }
`;
