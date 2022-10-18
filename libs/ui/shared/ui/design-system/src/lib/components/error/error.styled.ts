import styled from 'styled-components';

import { breakpoints } from '@archie-microservices/ui/shared/ui/theme';

export const ErrorStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  .subtitle {
    margin-top: 1.5rem;
  }

  .error-img {
    max-width: 200px;
    margin: 2.5rem 0;

    @media (max-width: ${breakpoints.screenSM}) {
      max-width: 150px;
    }
  }
`;
