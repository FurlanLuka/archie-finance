import styled from 'styled-components';

import { breakpoints } from '@archie/ui/shared/theme';

export const OptionsHandlerStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 4rem auto;

  @media (max-width: ${breakpoints.screenMD}) {
    width: 100%;
  }
`;
