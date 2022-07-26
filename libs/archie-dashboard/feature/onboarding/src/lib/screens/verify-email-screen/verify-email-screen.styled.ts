import styled from 'styled-components';

import { breakpoints } from '@archie-webapps/shared/ui/theme';

export const VerifyEmailScreenStyled = styled.div`
  width: 100%;
  max-width: 496px;

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
`;
