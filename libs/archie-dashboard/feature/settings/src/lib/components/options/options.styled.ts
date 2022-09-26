import styled from 'styled-components';

import { breakpoints } from '@archie-webapps/shared/ui/theme';

export const OptionsStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 3.5rem auto 3rem;

  @media (max-width: ${breakpoints.screenMD}) {
    width: 100%;
  }
`;
