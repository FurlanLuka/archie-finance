import { Logo } from '../icons/logo'
import { Container } from '../layout/layout.styled'
import { HeaderLayout } from './header.styled'

/**
 * The main header of the website.
 * @param {ComponentProps} props
 * @returns {StatelessComponent}
 */
const Header = () => (
  <HeaderLayout>
    <Container alignItems="center" justifyContent="space-between">
      <Logo className="logo" />
    </Container>
  </HeaderLayout>
)


export default Header
