import styled from 'styled-components';

import { breakpoints } from '@archie-webapps/shared/ui/theme';

export const KycScreenStyled = styled.div`
  width: 100%;
  max-width: 496px;

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

  .income {
    -moz-appearance: textfield;

    ::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
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
`;
