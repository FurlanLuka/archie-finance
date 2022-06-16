import styled from 'styled-components'

import breakpoints from '../../../../../constants/ui/breakpoints';

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

  .title {
    margin-bottom: 0.5rem;
  }

  .subtitle {
    margin-bottom: 2rem;
  }

  form {
    width: 100%;
  }

  .input-group {
    display: flex;
    gap: 1rem;

    @media (max-width: ${breakpoints.screenSM}) {
      flex-direction: column;
      gap: 0;
    }  
  }

  .phone-number {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;

    p {    
      margin-top: 0.35rem;
    }
  }

  .error {
    margin: 0.25rem 0;
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