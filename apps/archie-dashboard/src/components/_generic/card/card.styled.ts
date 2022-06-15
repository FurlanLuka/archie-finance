import styled from 'styled-components'

import breakpoints from '../../../constants/breakpoints'

interface CardProps {
  column?: boolean;
  alignItems?: string;
  justifyContent?: string;
  maxWidth?: string
  padding?: string;
  mobileColumn?: boolean;
  mobileJustifyContent?: string;
  mobileAlignItems?: string;
}

export const Card = styled.div<CardProps>`
  display: flex;
  flex-direction: ${({ column }) => column ? 'column' : 'row'};
  justify-content: ${({ justifyContent }) => justifyContent};
  align-items: ${({ alignItems }) => alignItems};
  background-color: ${({ theme }) => theme.backgroundPrimary};
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
    margin-bottom: 0.5rem;
  }

  .card-text {
    letter-spacing: 0.02em;
  }

  .btn-group {
    display: flex;
    gap: 0.5rem;
  }


  
`
