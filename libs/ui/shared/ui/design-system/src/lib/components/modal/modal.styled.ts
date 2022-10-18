import styled from 'styled-components';

import { breakpoints } from '@archie-microservices/ui/shared/ui/theme';

interface ModalProps {
  isOpen: boolean;
}

interface ModalContentProps {
  maxWidth?: string;
}

export const ModalStyled = styled.div<ModalProps>`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transition: opacity 0.2s ease;
  z-index: 3;
`;

export const ModalOverlay = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
`;

export const ModalContent = styled.div<ModalContentProps>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.backgroundPrimary};
  border-radius: 0.5rem;
  width: 90%;
  max-width: ${({ maxWidth }) => maxWidth};
  padding: 2rem 2rem 2.5rem;
  z-index: 2;

  @media (max-width: ${breakpoints.screenSM}) {
    padding: 1.5rem 1rem 2.5rem;
  }
`;
