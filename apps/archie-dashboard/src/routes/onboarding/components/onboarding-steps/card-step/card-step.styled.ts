import styled from 'styled-components';

import { breakpoints } from '@archie-webapps/ui-theme';

export const CardStepStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.backgroundPrimary};
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.08);
  border: 0;
  border-radius: 1rem;
  width: 100%;
  max-width: 928px;
  padding: 2.5rem 7% 3.5rem;
  text-align: center;

  @media (max-width: ${breakpoints.screenSM}) {
    padding: 2.5rem 1.5rem 3.5rem;
  }

  .title {
    margin-bottom: 0.5rem;
  }

  .subtitle {
    margin-bottom: 2rem;
  }

  .image {
    width: 16rem;
  }

  button {
    margin-top: 2rem;
  }
`;
