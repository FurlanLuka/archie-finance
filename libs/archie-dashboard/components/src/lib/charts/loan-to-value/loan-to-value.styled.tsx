import styled from 'styled-components';

import { breakpoints } from '@archie-webapps/shared/ui/theme';

export const LoanToValueChartStyled = styled.div`
  position: relative;
  height: 216px;
  width: 216px;

  @media (max-width: ${breakpoints.screenMD}) {
    height: 200px;
    width: 200px;
  }

  @media (max-width: ${breakpoints.screenSM}) {
    height: 180px;
    width: 180px;
  }

  .centered-metrics {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .status-label {
    margin-top: 0.25rem;
  }
`;
