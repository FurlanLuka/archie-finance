import styled from 'styled-components';

import { breakpoints, HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from '@archie-webapps/shared/ui/theme';

import bgOnboarding from '../../../assets/bg-onboarding.png';

export const Page = styled.div`
  display: flex;
  color: ${({ theme }) => theme.textPrimary};
  background-color: ${({ theme }) => theme.backgroundSecondary};
  background-image: url(${bgOnboarding});
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: bottom;
  width: 100%;
  min-height: 100vh;
  padding-top: ${HEADER_HEIGHT};

  @media (max-width: ${breakpoints.screenSM}) {
    min-height: 100vh;
    padding-top: ${HEADER_HEIGHT_MOBILE};
  }
`;

export interface ContainerProps {
  column?: boolean;
  alignItems?: string;
  justifyContent?: string;
  maxWidth?: string;
  mobileColumn?: boolean;
  mobileJustifyContent?: string;
  mobileAlignItems?: string;
}

export const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: ${({ column }) => (column ? 'column' : 'row')};
  justify-content: ${({ justifyContent }) => justifyContent};
  align-items: ${({ alignItems }) => alignItems};
  max-width: ${({ maxWidth }) => maxWidth ?? '1400px'};
  width: 100%;
  margin: 0 auto;

  @media (max-width: ${breakpoints.screenMD}) {
    flex-direction: ${({ mobileColumn }) => (mobileColumn ? 'column' : 'row')};
    justify-content: ${({ mobileJustifyContent }) => mobileJustifyContent};
    align-items: ${({ mobileAlignItems }) => mobileAlignItems};
  }
`;
