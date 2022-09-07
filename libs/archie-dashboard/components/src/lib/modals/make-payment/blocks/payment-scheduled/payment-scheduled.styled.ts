import styled from 'styled-components';

export const PaymentScheduledModalStyled = styled.div`
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

  .scheduled-note {
    margin-bottom: 2rem;
  }

  .btn-group {
    margin-top: 4rem;
  }
`;
