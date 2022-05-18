import { Logo } from '../icons/logo';
import { Container } from '../layout/layout.styled';
import { HeaderStyled } from './header.styled';

/**
 * The main header of the website.
 * @param {ComponentProps} props
 * @returns {StatelessComponent}
 */
const Header = () => (
  <HeaderStyled>
    <Container alignItems="center" justifyContent="space-between">
      <Logo className="logo" />
    </Container>
  </HeaderStyled>
);

export default Header;
