import styled from 'styled-components';

import { breakpoints, NAV_WIDTH, NAV_WIDTH_TABLET } from '@archie-webapps/shared/ui/theme';

export const CollateralizationStyled = styled.div`
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
    margin-bottom: 1rem;
  }

  .subtitle-asset {
    text-align: center;
    margin-bottom: 3rem;
  }

  .subtitle-credit {
    text-align: center;
    max-width: 530px;
    margin-bottom: 1rem;
  }

  .subtitle-margin-call {
    text-align: center;
    max-width: 530px;
    margin-bottom: 3rem;
  }

  .cancel-btn {
    margin-top: 1rem;
  }
`;
