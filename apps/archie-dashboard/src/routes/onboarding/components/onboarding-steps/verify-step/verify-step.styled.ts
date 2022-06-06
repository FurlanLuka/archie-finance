import styled from 'styled-components'

import breakpoints from '../../../../../constants/breakpoints';

export const VerifyStepStyled = styled.div`
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
    margin-bottom: 3rem;
  }

  .code-input {
    width: 100% !important;
    margin-bottom: 3rem;

    div {
      display: flex;
      justify-content: space-between;
    }

    input {
      font-family: ${({ theme }) => theme.fontPrimary};
      font-size: 2rem;
      color: ${({ theme }) => theme.textPrimary};
      border: 1px solid ${({ theme }) => theme.borderHighlight} !important;
      border-radius: 0.5rem;
      height: 6rem !important;
      width: 15% !important;

      @media (max-width: ${breakpoints.screenSM}) {
        height: 4.5rem !important;
      }  
    }
  }

  .resend-text {
    margin-bottom: 0.5rem;
  }

  .resend-btn {
    background-color: ${({ theme }) => theme.buttonOutline};
    color: ${({ theme }) => theme.textHighlight};
    border: 0;
    margin-bottom: 1rem;
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