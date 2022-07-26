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

  .text {
    width: 90%;
    margin-bottom: 1.5rem;

  }

  .link {
    display: flex;
    justify-content: flex-start;
    width: 90%;
    margin-bottom: 2rem;
  }

  .logout-btn {
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

  .resend-btn {
    margin-bottom: 0.5rem;
  }
`;
