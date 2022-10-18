import styled from 'styled-components';

import { breakpoints, NAV_WIDTH, NAV_WIDTH_TABLET } from '@archie-webapps/shared/ui/theme';

export const ErrorScreenStyled = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 3rem 2rem;

  @media (max-width: ${breakpoints.screenLG}) {
    padding: 3rem 2rem;
  }

  @media (max-width: ${breakpoints.screenMD}) {
    padding: 1.5rem 1rem;
  }
`;
