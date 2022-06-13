import { FC } from 'react';
import { Logo } from '../icons/logo';
import { Container } from '../layout/layout.styled';
import { HeaderStyled } from './header.styled';

interface HeaderProps {
  maxWidth?: string;
}

/**
 * The main header of the website.
 * @param {ComponentProps} props
 * @returns {StatelessComponent}
 */
const Header: FC<HeaderProps> = ({ maxWidth }) => (
  <HeaderStyled>
    <Container alignItems="center" justifyContent="space-between" maxWidth={maxWidth}>
      <Logo className="logo" />
    </Container>
  </HeaderStyled>
);

export default Header;
