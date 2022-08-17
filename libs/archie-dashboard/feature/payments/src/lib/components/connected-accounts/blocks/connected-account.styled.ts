import styled from 'styled-components';

export const ConnectedAccountStyled = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1rem 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.borderPrimary};

  .remove-account {
    margin-left: auto;
  }

  .account-details {
    color: ${({ theme }) => theme.textSecondary};
  }
`;
