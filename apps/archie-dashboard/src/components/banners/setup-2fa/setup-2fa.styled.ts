import styled from 'styled-components';

import { breakpoints, NAV_WIDTH, NAV_WIDTH_TABLET } from '@archie-webapps/shared/ui/theme';

export const Setup2faBannerStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 3rem;
  background-color: ${({ theme }) => theme.backgroundPositive};
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  margin-left: ${NAV_WIDTH};

  @media (max-width: ${breakpoints.screenLG}) {
    margin-left: ${NAV_WIDTH_TABLET};
  }

  @media (max-width: ${breakpoints.screenMD}) {
    margin: 0;
  }

  @media (max-width: ${breakpoints.screenSM}) {
    gap: 1rem;
    align-items: flex-start;
  }

  .content {
    display: flex;
    gap: 3rem;

    @media (max-width: ${breakpoints.screenSM}) {
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  .image {
    line-height: 1;
    max-width: 44px;

    @media (max-width: ${breakpoints.screenSM}) {
      margin-top: 0.25rem;
    }
  }
`;
