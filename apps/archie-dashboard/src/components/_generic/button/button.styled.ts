import styled from 'styled-components'

import breakpoints from '../../../constants/breakpoints'

interface ButtonProps {
  isDisabled?: boolean;
  minWidth?: string;
}

const Button = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
  line-height: 1;
  font-weight: 700;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  border: 1px solid;
  max-height: 3rem;
  min-width: ${({ minWidth }) => minWidth ?? '100%'};
  cursor: ${({ isDisabled }) => isDisabled ? 'not-allowed' : 'pointer'};

  @media (max-width: ${breakpoints.screenSM}) {
    min-width: 100%;
  }  

  :hover {
    opacity: ${({ isDisabled }) => isDisabled ? '1' : '0.8'};
  }
`

export const ButtonPrimary = styled(Button)`
  background-color: ${({ theme }) => theme.buttonPrimary};
  color: ${({ theme }) => theme.textLight};
  border-color: ${({ theme }) => theme.buttonPrimary};
`

export const ButtonOutline = styled(Button)`
  background-color: ${({ theme }) => theme.buttonOutline};
  color: ${({ theme }) => theme.textHighlight};
  border-color: ${({ theme }) => theme.textHighlight};
`

export const ButtonGhost = styled(Button)`
  background-color: ${({ theme }) => theme.buttonOutline};
  color: ${({ theme }) => theme.textLight};
  border-color: ${({ theme }) => theme.textLight};
`
