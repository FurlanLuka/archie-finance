import styled from 'styled-components'

export const KycStepStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.backgroundPrimary};
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.08);
  border: 0;
  border-radius: 1rem;
  width: 100%;
  max-width: 496px;
  padding: 1.5rem;
  text-align: center;

  h4 {
    margin-bottom: 0.5rem;
  }

  p {
    margin-bottom: 2rem;
  }

  form {
    width: 100%;
  }

  .input-group {
    display: flex;
    gap: 1rem;
  }

  .divider {
    height: 1px;
  	width: 100%;
    background-color: ${({ theme }) => theme.borderPrimary};
    border: 0;
    margin-bottom: 1.5rem;
  }  

  button {
    margin-bottom: 0.5rem;
  }
`