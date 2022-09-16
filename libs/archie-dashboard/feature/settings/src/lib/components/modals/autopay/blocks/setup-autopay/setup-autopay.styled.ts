import styled from 'styled-components';

export const SetupAutopayStyled = styled.div`
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
    margin: 1.5rem 0;
  }
`;
