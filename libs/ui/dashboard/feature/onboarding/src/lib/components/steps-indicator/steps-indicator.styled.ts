import styled from 'styled-components';

import { breakpoints } from '@archie-microservices/ui/shared/ui/theme';

export const StepsIndicatorStyled = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6rem;
  margin-bottom: 2rem;

  @media (max-width: ${breakpoints.screenSM}) {
    gap: 1.5rem;
  }

  .step {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 6rem;
  }

  .circle {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 100%;
    background-color: ${({ theme }) => theme.textDisabled};
    margin-bottom: 0.5rem;
  }

  .icon-active {
    margin-top: -5px;
    margin-left: -5px;
  }

  .arrow {
    position: absolute;
    top: 0.5rem;
    right: -6rem;

    @media (max-width: ${breakpoints.screenSM}) {
      width: 4.5rem;
      right: -3rem;
    }
  }
`;
