import styled from 'styled-components';

export const WithdrawalSkeletonStyled = styled.div`
  width: 700px;

  display: flex;
  flex-direction: column;
  align-items: center;

  .credit-subtitle {
    height: 1.5rem;
    width: 536px;

    margin-top: 1rem;
  }

  .input-label {
    width: 300px;
    height: 1rem;
    align-self: flex-start;

    margin-bottom: 8px;
    margin-top: 5rem;
  }

  .input {
    width: 100%;
    height: 72px;
  }

  .credit-info {
    width: 100%;
    height: 3.5rem;

    margin: 1rem 0 2rem 0;
  }

  .address {
    width: 100%;
    height: 220px;
  }
`;
