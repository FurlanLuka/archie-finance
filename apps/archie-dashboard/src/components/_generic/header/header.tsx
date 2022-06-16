import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticatedSession } from '@archie/session/hooks/use-session';
import { Logo } from '../icons/logo';
import { Close } from '../icons/close';
import { Container } from '../layout/layout.styled';
import { ParagraphS } from '../typography/typography.styled';
import { dashboardNavItems } from '../../../constants/dashboard-nav-items';
import { HeaderStyled, MobileNav } from './header.styled';

interface HeaderProps {
  maxWidth?: string;
}

/**
 * The main header of the website.
 * @param {ComponentProps} props
 * @returns {StatelessComponent}
 */
const Header: FC<HeaderProps> = ({ maxWidth }) => {
  const navigate = useNavigate();
  const { logout } = useAuthenticatedSession();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    document.body.classList.toggle('no-scroll');
    setMobileNavOpen(!mobileNavOpen);
  };

  const closeMobileNav = () => {
    document.body.classList.toggle('no-scroll');
    setMobileNavOpen(false);
  };

  return (
    <>
      <HeaderStyled isOpen={mobileNavOpen}>
        <Container alignItems="center" justifyContent="space-between" maxWidth={maxWidth}>
          <Logo className="logo" />
          <button className="menu-button hide-lg" onClick={toggleMobileNav}>
            <div className="line one"></div>
            <div className="line two"></div>
            <Close className="close" />
          </button>
        </Container>
      </HeaderStyled>

      <MobileNav isOpen={mobileNavOpen}>
        <div className="links">
          {dashboardNavItems.map((item, index) => (
            <div
              className="nav-item"
              key={index}
              onClick={() => (item.name === 'logout' ? logout : navigate(item.path))}
            >
              <div className="icon">{item.icon}</div>
              <ParagraphS weight={700}>{item.name}</ParagraphS>
            </div>
          ))}
        </div>
      </MobileNav>
    </>
  );
};

export default Header;
