import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthenticatedSession } from '@archie-webapps/shared/data-access-session';
import { Icon } from '@archie-webapps/shared/ui-icons';
import { dashboardNavItems } from '@archie-webapps/util-constants';

import { Container } from '../layout/layout.styled';
import { ParagraphS } from '../typography/typography.styled';

import { HeaderStyled, MobileNav } from './header.styled';

export interface HeaderProps {
  maxWidth?: string;
}

export const Header: FC<HeaderProps> = ({ maxWidth }) => {
  const navigate = useNavigate();
  const { logout } = useAuthenticatedSession();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    document.body.classList.toggle('no-scroll');
    setMobileNavOpen(!mobileNavOpen);
  };

  const handleLinkItemClick = (itemName: string, itemPath: string) => {
    if (itemName === 'logout') {
      logout();
    } else {
      navigate(itemPath);
      setMobileNavOpen(false);
      document.body.classList.toggle('no-scroll');
    }
  };

  return (
    <>
      <HeaderStyled isOpen={mobileNavOpen}>
        <Container alignItems="center" justifyContent="space-between" maxWidth={maxWidth}>
          <Icon name="logo" className="logo" />
          <button className="menu-button hide-lg" onClick={toggleMobileNav}>
            <div className="line one"></div>
            <div className="line two"></div>
            <Icon name="close" className="close" />
          </button>
        </Container>
      </HeaderStyled>

      <MobileNav isOpen={mobileNavOpen}>
        <div className="links">
          {dashboardNavItems.map((item, index) => (
            <div className="link-item" key={index} onClick={() => handleLinkItemClick(item.name, item.path)}>
              <div className="icon">
                <Icon name={item.icon} />
              </div>
              <ParagraphS weight={700}>{item.name}</ParagraphS>
            </div>
          ))}
        </div>
      </MobileNav>
    </>
  );
};
