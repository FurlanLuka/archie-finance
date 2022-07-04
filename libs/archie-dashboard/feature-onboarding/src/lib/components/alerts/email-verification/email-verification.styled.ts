import styled from 'styled-components';

import { breakpoints } from '@archie-webapps/ui-theme';

export const EmailVerificationAlertStyled = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.backgroundAlert};
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.08);
  border: 0;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 928px;
  padding: 0.75rem 3rem;
  margin-bottom: 1.5rem;

  @media (max-width: ${breakpoints.screenSM}) {
    padding: 0.75rem 1rem;
  }

  .image {
    max-height: 3rem;
    max-width: 4rem;
    margin-right: 1.5rem;

    @media (max-width: ${breakpoints.screenSM}) {
      margin-right: 0;
    }
  }

  button {
    border: 0;
    font-size: inherit;
    background-color: ${({ theme }) => theme.buttonOutline};
    font-weight: 700;
    padding: 0 0.25rem;
    cursor: pointer;
  }
`;
