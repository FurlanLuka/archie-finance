import styled from 'styled-components'

import bgOnboarding from '../../assets/images/bg-onboarding.png'

import breakpoints from '../../constants/breakpoints'

export const OnboardingStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: ${({ theme }) => theme.backgroundSecondary};
  background-image: url(${bgOnboarding});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: bottom;
  width: 100%;
  padding: 2rem 1rem;

  @media (max-width: ${breakpoints.screenSM}) {
    padding: 1.5rem 1rem;
  }
`

