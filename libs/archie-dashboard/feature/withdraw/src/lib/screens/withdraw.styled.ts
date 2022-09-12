import styled from 'styled-components';

import { breakpoints, NAV_WIDTH, NAV_WIDTH_TABLET } from '@archie-webapps/shared/ui/theme';

export const WithdrawScreenStyled = styled.div`
  width: 100%;
  max-width: calc(1000px + 4rem);
  margin-left: ${NAV_WIDTH};
  padding: 3rem 2rem;

  @media (max-width: ${breakpoints.screenLG}) {
    margin-left: ${NAV_WIDTH_TABLET};
  }

  @media (max-width: ${breakpoints.screenMD}) {
    margin: 0;
  }

  @media (max-width: ${breakpoints.screenSM}) {
    padding: 1.5rem 1rem;
  }

  .title {
    margin-bottom: 0.5rem;
  }

  .subtitle {
    margin-bottom: 3rem;
  }

  .link {
    color: ${({ theme }) => theme.textHighlight};
  }
`;
