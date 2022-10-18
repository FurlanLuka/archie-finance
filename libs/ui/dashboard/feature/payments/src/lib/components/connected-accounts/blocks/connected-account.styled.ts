import styled from 'styled-components';

export const ConnectedAccountStyled = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.borderPrimary};
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  width: 100%;

  .remove-account {
    margin-left: auto;
  }

  .account-details {
    color: ${({ theme }) => theme.textSecondary};
  }
`;
