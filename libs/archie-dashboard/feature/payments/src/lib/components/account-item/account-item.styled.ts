import styled from 'styled-components';

export const AccountItemStyled = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  .circle {
    background-color: ${({ theme }) => theme.textDisabled};
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 100%;
    margin-right: 0.5rem;
  }

  .account-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .account-balance {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    margin-left: auto;
  }

  .subtitle {
    color: ${({ theme }) => theme.textSecondary};
  }

  p {
    line-height: 1.2;
  }
`;
