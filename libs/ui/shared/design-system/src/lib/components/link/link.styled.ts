import styled, { keyframes } from 'styled-components';

const flash = keyframes`
  0% {
    background-color: #bdc0c1;
    box-shadow: 12px 0 #bdc0c1, -12px 0 #9fa3a4;
  }
  50% {
    background-color: #9fa3a4;
    box-shadow: 12px 0 #bdc0c1, -12px 0 #bdc0c1;
  }
  100% {
    background-color: #bdc0c1;
    box-shadow: 12px 0 #9fa3a4, -12px 0 #bdc0c1;
  }
`

export interface LinkProps {
  isDisabled?: boolean;
  color?: string;
  padding?: string;
}

export const Link = styled.a<LinkProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: inherit;
  color: ${({ theme, isDisabled, color }) => isDisabled ? theme.textDisabled : (color ? color : theme.textHighlight)};
  font-weight: inherit;
  padding: ${({ padding }) => padding ?? '0 0.25rem'};

  svg {
    color: ${({ theme, isDisabled }) => isDisabled ? theme.textDisabled : 'inherit'};
  }
`

export interface LinkAsButtonProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  width?: string;
  small?: boolean;
  color?: string;
}

export const LinkAsButton = styled.a<LinkAsButtonProps>`
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
  width: ${({ width }) => width};
  padding: ${({ small }) => (small ? '0.25rem 1rem' : '1rem 2rem')};
  pointer-events: ${({ isDisabled, isLoading }) =>
    isDisabled || isLoading ? 'none' : 'all'};
  cursor: pointer;

  :hover {
    opacity: ${({ isDisabled, isLoading }) =>
      isDisabled || isLoading ? '1' : '0.5'};
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
    background-color: ${({ theme }) => theme.loadingDotActive};
    box-shadow: ${({ theme }) => `12px 0 ${theme.loadingDotActive}, -12px 0 ${theme.loadingDotActive}`};
    border-radius: 100%;
    width: ${({ small }) => (small ? '0.4rem' : '0.5rem')};
    height: ${({ small }) => (small ? '0.4rem' : '0.5rem')};
    margin: 0 12px;
    animation: ${flash} 0.6s ease-out infinite alternate;
    display: ${({ isLoading }) => (isLoading ? 'flex' : 'none')};
  }
`;

export const LinkAsButtonPrimary = styled(LinkAsButton)`
  background-color: ${({ theme, isDisabled }) =>
    isDisabled ? theme.buttonDisabled : theme.buttonPrimary};
  color: ${({ theme }) => theme.textLight};
  border-color: ${({ theme, isDisabled }) =>
    isDisabled ? theme.buttonDisabled : theme.buttonPrimary};
`;

export const LinkAsButtonOutline = styled(LinkAsButton)`
  background-color: ${({ theme }) => theme.buttonOutline};
  color: ${({ theme, isDisabled, color }) =>
    isDisabled ? theme.buttonDisabled : color || theme.buttonPrimary};
  border-color: ${({ theme, isDisabled, color }) =>
    isDisabled ? theme.buttonDisabled : color || theme.buttonPrimary};
`;

export const LinkAsButtonGhost = styled(LinkAsButton)`
  background-color: ${({ theme }) => theme.buttonOutline};
  color: ${({ theme, isDisabled }) =>
    isDisabled ? theme.buttonDisabled : theme.buttonGhost};
  border-color: ${({ theme, isDisabled }) =>
    isDisabled ? theme.buttonDisabled : theme.buttonGhost};
`;

export const LinkAsButtonLight = styled(LinkAsButton)`
  background-color: ${({ theme, isDisabled }) =>
    isDisabled ? theme.buttonDisabled : theme.buttonLight};
  color: ${({ theme, color }) => color ?? theme.textPrimary};
  border-color: ${({ theme, isDisabled }) =>
    isDisabled ? theme.buttonDisabled : theme.buttonLight};
`;
