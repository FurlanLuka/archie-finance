import styled from 'styled-components';

export const ConnectedAccountItemStyled = styled.div`
  display: flex;
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

  p {
    line-height: 1.2;
  }
`;
