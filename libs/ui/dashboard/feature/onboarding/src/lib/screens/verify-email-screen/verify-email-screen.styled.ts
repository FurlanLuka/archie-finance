import styled from 'styled-components';

import { breakpoints } from '@archie/ui/shared/ui/theme';

export const VerifyEmailScreenStyled = styled.div`
  width: 100%;
  max-width: 496px;

  .title {
    margin-bottom: 2rem;
  }

  .text {
    width: 90%;
    margin-bottom: 1.5rem;

    @media (max-width: ${breakpoints.screenSM}) {
      width: 100%;
    }
  }

  .link {
    display: flex;
    justify-content: flex-start;
    width: 90%;
    margin-bottom: 2rem;

    @media (max-width: ${breakpoints.screenSM}) {
      width: 100%;
    }
  }

  .logout-btn {
    background-color: ${({ theme }) => theme.buttonOutline};
    color: ${({ theme }) => theme.textHighlight};
    border: 0;
    margin-bottom: 1rem;
    cursor: pointer;
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
