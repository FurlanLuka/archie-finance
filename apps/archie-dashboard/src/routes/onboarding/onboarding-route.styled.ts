import styled from 'styled-components'

import bgOnboarding from '../../assets/images/bg-onboarding.png'

import breakpoints from '../../constants/breakpoints'

export const OnboardingLayout = styled.div`
  display: flex;
  justify-content: center;
  background-image: url(${bgOnboarding});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: bottom;
  width: 100%;
  padding: 5rem 1rem;

  @media (max-width: ${breakpoints.screenMD}) {
    padding: 3rem 1rem;
  }

  @media (max-width: ${breakpoints.screenSM}) {
    padding: 2rem 1rem;
  }
`

