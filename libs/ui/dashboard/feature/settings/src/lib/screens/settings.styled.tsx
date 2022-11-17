import styled from 'styled-components';

import { breakpoints } from '@archie/ui/shared/theme';

export const SettingsStyled = styled.div`
  width: 100%;
  max-width: calc(1000px + 4rem);
  padding: 3rem 2rem;

  @media (max-width: ${breakpoints.screenSM}) {
    padding: 1.5rem 1rem;
  }

  .title {
    margin-bottom: 1.5rem;
  }

  .section-title {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-height: 68px;
    margin-bottom: 1.5rem;

    @media (max-width: ${breakpoints.screenSM}) {
      min-height: 58px;
    }
  }

  .name {
    margin-bottom: 0.5rem;
  }
`;
