import styled from 'styled-components';

import { breakpoints } from '@archie-webapps/shared/ui-theme';

export const CollateralValueStyled = styled.div`
  height: 32px;
  width: 100%;
  margin: -0.5rem 0 0.75rem;

  @media (max-width: ${breakpoints.screenMD}) {
    height: 60px;
  }
`;
