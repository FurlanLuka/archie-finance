import { FC } from 'react';

import { ModalStyled, ModalOverlay, ModalContent } from './modal.styled';

export interface ModalProps {
  isOpen: boolean;
  close?: () => void;
  maxWidth?: string;
}

export const Modal: FC<ModalProps> = ({
  children,
  isOpen,
  close,
  maxWidth,
}) => (
  <ModalStyled isOpen={isOpen}>
    <ModalOverlay onClick={close} />
    <ModalContent maxWidth={maxWidth}>{children}</ModalContent>
  </ModalStyled>
);
