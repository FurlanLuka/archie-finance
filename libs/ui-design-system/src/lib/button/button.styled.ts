import styled, { keyframes } from 'styled-components';

import { breakpoints } from '@archie-webapps/ui-theme';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

interface ButtonProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  maxWidth?: string;
  small?: boolean;
  color?: string;
}

const Button = styled.button<ButtonProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: ${({ small }) => (small ? '0.75rem' : '1rem')};
  line-height: 1;
  font-weight: 700;
  border: 1px solid;
  border-radius: ${({ small }) => (small ? '0.25rem' : '0.5rem')};
  max-height: 3rem;
  width: ${({ maxWidth }) => maxWidth ?? '100%'};
  padding: ${({ small }) => (small ? '0.25rem 1rem' : '1rem 2rem')};
  cursor: ${({ isDisabled, isLoading }) => (isDisabled || isLoading ? 'not-allowed' : 'pointer')};

  @media (max-width: ${breakpoints.screenSM}) {
    width: 100%;
  }

  :hover {
    opacity: ${({ isDisabled, isLoading }) => (isDisabled || isLoading ? '1' : '0.5')};
  }

  :before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    width: calc(100% + 2px);
    height: calc(100% + 2px);
    background-color: ${({ theme }) => theme.buttonDisabled};
    border-radius: inherit;
    display: ${({ isLoading }) => (isLoading ? 'flex' : 'none')};
  }

  :after {
    content: '';
    position: absolute;
    border: 2px solid ${({ theme }) => theme.loaderBorder};
    border-top: 2px solid ${({ theme }) => theme.loaderBorderTop};
    border-radius: 100%;
    width: 1.75rem;
    height: 1.75rem;
    animation: ${spin} 0.8s linear infinite;
    display: ${({ isLoading }) => (isLoading ? 'flex' : 'none')};
  }
`;

export const ButtonPrimary = styled(Button)`
  background-color: ${({ theme, isDisabled }) => (isDisabled ? theme.buttonDisabled : theme.buttonPrimary)};
  color: ${({ theme }) => theme.textLight};
  border-color: ${({ theme, isDisabled }) => (isDisabled ? theme.buttonDisabled : theme.buttonPrimary)};
`;

export const ButtonOutline = styled(Button)`
  background-color: ${({ theme }) => theme.buttonOutline};
  color: ${({ theme, isDisabled}) => (isDisabled ? theme.buttonDisabled : theme.buttonPrimary)};
  border-color: ${({ theme, isDisabled}) => (isDisabled ? theme.buttonDisabled : theme.buttonPrimary)};
`;

export const ButtonGhost = styled(Button)`
  background-color: ${({ theme }) => theme.buttonOutline};
  color: ${({ theme, isDisabled}) => (isDisabled ? theme.buttonDisabled : theme.buttonGhost)};
  border-color: ${({ theme, isDisabled}) => (isDisabled ? theme.buttonDisabled : theme.buttonGhost)};
`;

export const ButtonLight = styled(Button)`
  background-color: ${({ theme, isDisabled}) => (isDisabled ? theme.buttonDisabled : theme.buttonLight)};
  color: ${({ theme, color }) => color ?? theme.textPrimary};
  border-color: ${({ theme, isDisabled}) => (isDisabled ? theme.buttonDisabled : theme.buttonLight)};
`;
