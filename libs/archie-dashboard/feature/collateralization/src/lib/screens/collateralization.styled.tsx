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
    margin-bottom: 0.5rem;
  }

  .subtitle {
    text-align: center;
    margin-bottom: 3rem;
    max-width: 530px;
  }

  .subtitle-asset {
    text-align: center;
    margin: 1rem 0;
    max-width: 530px;
  }

  .loader-container {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
  }

  .cancel-btn {
    margin-top: 1rem;
  }
`;
