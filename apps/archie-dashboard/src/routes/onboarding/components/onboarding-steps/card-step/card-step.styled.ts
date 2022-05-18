import styled from 'styled-components';

export const CardStepStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.backgroundPrimary};
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.08);
  border: 0;
  border-radius: 1rem;
  width: 100%;
  padding: 2.5rem 12% 7rem;
  text-align: center;

  p {
    margin-bottom: 1rem;
  }

  .divider {
    height: 1px;
  	width: 100%;
    background-color: ${({ theme }) => theme.borderPrimary};
    border: 0;
    margin: 1rem 0 1.5rem;
  } 

  .image {
    width: 16rem;
  }

  button {
    margin-top: 1rem;
  }
`;
