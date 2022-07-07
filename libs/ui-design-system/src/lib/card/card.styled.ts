import styled from 'styled-components'

import { breakpoints } from '@archie-webapps/ui-theme';

interface CardProps {
  column?: boolean;
  alignItems?: string;
  justifyContent?: string;
  maxWidth?: string
  padding?: string;
  mobileRow?: boolean;
  columnReverse?: boolean;
  mobileJustifyContent?: string;
  mobileAlignItems?: string;
  backgroundImage?: string;
}

export const Card = styled.div<CardProps>`
  position: relative;
  display: flex;
  flex-direction: ${({ column }) => column ? 'column' : 'row'};
  justify-content: ${({ justifyContent }) => justifyContent};
  align-items: ${({ alignItems }) => alignItems};
  background-color: ${({ theme }) => theme.backgroundPrimary};
  background-image: ${({ backgroundImage }) => `url(${backgroundImage})`};
  background-size: cover;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.08);
  border-radius: 0.5rem;
  width: 100%;
  max-width: ${({ maxWidth }) => maxWidth ?? '100%'};
  padding: ${({ padding }) => padding};

  @media (max-width: ${breakpoints.screenSM}) {
    flex-direction: ${({ columnReverse, mobileRow }) => columnReverse ? 'column-reverse' : mobileRow ? 'row' : 'column'};
    justify-content: ${({ mobileJustifyContent }) => mobileJustifyContent};
    align-items: ${({ mobileAlignItems }) => mobileAlignItems};
  }

  .p-bottom {
    padding-bottom: 1.5rem;
  }

  .p-bottom-sm {
    @media (max-width: ${breakpoints.screenSM}) {
      padding-bottom: 1.5rem;
    }
  }

  .card-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .card-title {
    letter-spacing: 0.02em;
    margin-bottom: 0.5rem;
  }

  .card-info {
    position: relative;
    margin-bottom: 0.5rem;

    :before {
      content: '';
      display: none;
      position: absolute;
      left: 0;
      width: 2px;
      height: 100%;
      border-radius: 2px;
    }

    &.border-default {
      padding-left: 0.5rem;
    
      :before {
        display: block;
        background-color: ${({ theme }) => theme.loanToValueDefault};
      }
    }

    &.border-active {
      padding-left: 0.5rem;
    
      :before {
        display: block;
        background-color: ${({ theme }) => theme.loanToValueActive};
      }
    }
  }

  .card-text {
    letter-spacing: 0.02em;
  }

  .btn-group {
    display: flex;
    gap: 0.5rem;
  }  
`
