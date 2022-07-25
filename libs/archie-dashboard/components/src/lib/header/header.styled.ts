import styled from 'styled-components';

import { breakpoints } from '@archie-webapps/shared/ui/theme';

interface HeaderProps {
  isOpen: boolean;
}

export const HeaderStyled = styled.div<HeaderProps>`
  position: fixed;
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.backgroundPrimary};
  border-bottom: 1px solid ${({ theme }) => theme.borderPrimary};
  width: 100%;
  padding: 1.5rem 2rem;
  z-index: 2;

  @media (max-width: ${breakpoints.screenSM}) {
    padding: 0.75rem 1rem;
  }

  .logo {
    margin-bottom: 4px;
  }

  .menu {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .menu-button {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 0;
    background: transparent;
    height: 2rem;
    min-width: 2rem;
    padding: 0;
  }

  .line {
    width: 20px;
    height: 2px;
    background-color: ${({ theme }) => theme.textPrimary};
    border-radius: 4px;
    margin: 3px 0;
    transform: ${({ isOpen }) => (isOpen ? `scaleX(0)` : `scaleX(1)`)};
    will-change: transform;
    transition: ${({ isOpen }) => (isOpen ? `transform .15s linear 0s` : `transform .15s linear 0.15s`)};

    &.one {
      transform-origin: 0 50%;
    }

    &.one {
      transform-origin: 100% 50%;
    }
  }

  .close {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 16px;
    height: 16px;
    transform: ${({ isOpen }) => (isOpen ? `scale(1)` : `scale(0)`)};
    will-change: transform;
    transition: ${({ isOpen }) => (isOpen ? `transform .15s linear 0.15s` : `transform .15s linear 0s`)};
  }
`;

export const MobileNav = styled.div<HeaderProps>`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  background-color: ${({ theme }) => theme.backgroundPrimary};
  transform: ${({ isOpen }) => (isOpen ? `translateY(0)` : `translateY(-100%)`)};
  will-change: transform;
  transition: transform 0.3s linear;
  padding: 3.75rem 1rem;
  z-index: 1;

  .links {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3rem;
    padding-top: 6rem;

    @media (max-width: ${breakpoints.screenSM}) {
      padding-top: 3rem;
    }

    p {
      font-size: 1rem;
    }
  }

  .link-item {
    display: flex;
    gap: 0.5rem;
  }
`;
