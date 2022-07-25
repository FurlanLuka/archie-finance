import styled from 'styled-components';

import { breakpoints } from '@archie-webapps/shared/ui-theme';

export const LoanToValueStyled = styled.div`
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
    font-size: 0.625rem;
    color: ${({ theme }) => theme.loanToValueActive};
    font-weight: 700;
    line-height: 1.6;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border: 1px solid ${({ theme }) => theme.loanToValueActive};
    border-radius: 0.5rem;
    max-width: fit-content;
    padding: 0 1rem;
    margin-top: 0.25rem;
  }
`;
