import styled from 'styled-components'

import breakpoints from '../../../constants/ui/breakpoints'

interface CardProps {
  column?: boolean;
  alignItems?: string;
  justifyContent?: string;
  maxWidth?: string
  padding?: string;
  mobileColumn?: boolean;
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
  background-size: 100%;
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.08);
  border-radius: 0.5rem;
  width: 100%;
  max-width: ${({ maxWidth }) => maxWidth ?? '100%'};
  padding: ${({ padding }) => padding};

  .p-bottom {
    padding-bottom: 1.5rem;
  }

  .card-title {
    letter-spacing: 0.02em;
    margin-bottom: 0.5rem;
  }

  .card-info {
    position: relative;
    margin-bottom: 0.75rem;

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
