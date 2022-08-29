import styled from 'styled-components';

export const SuccessfullWithdrawalModalStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .modal-title {
    margin-bottom: 0.5rem;
  }

  .modal-subtitle {
    margin-bottom: 1.5rem;
  }

  .link {
    color: ${({ theme }) => theme.textHighlight};
    padding-left: 0.25rem;
  }
`;
