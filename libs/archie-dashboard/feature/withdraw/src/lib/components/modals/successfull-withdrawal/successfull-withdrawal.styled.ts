import styled from 'styled-components';

export const SuccessfullWithdrawalModalStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .link {
    color: ${({ theme }) => theme.textHighlight};
    padding-left: 0.25rem;
  }
`;
