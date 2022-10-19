import styled from 'styled-components';

import { breakpoints } from '@archie/ui/shared/ui/theme';

export const OptionsHandlerStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 3.5rem auto 3rem;

  @media (max-width: ${breakpoints.screenMD}) {
    width: 100%;
  }
`;
