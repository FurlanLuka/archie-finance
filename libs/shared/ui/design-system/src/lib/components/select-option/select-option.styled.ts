import styled from 'styled-components';

import { breakpoints } from '@archie-webapps/shared/ui/theme';

export const SelectOptionStyled = styled.div`
  padding: 0.5rem 1rem;

  @media (max-width: ${breakpoints.screenSM}) {
    padding: 0.25rem 0.5rem;
  }
`;
