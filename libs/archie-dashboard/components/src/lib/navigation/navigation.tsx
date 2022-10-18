import { FC } from 'react';
import { NavLink } from 'react-router-dom';

import { dashboardNavItems } from '@archie-webapps/archie-dashboard/constants';
import { BodyS } from '@archie-webapps/shared/ui/design-system';
import { Icon } from '@archie-webapps/shared/ui/icons';
import { theme } from '@archie-webapps/shared/ui/theme';

import { NavigationStyled } from './navigation.styled';

export const Navigation: FC = () => (
  <NavigationStyled>
    {dashboardNavItems.map((item, index) => (
      <NavLink key={index} to={item.path} className="nav-item">
        <div className="nav-item-icon">
          <Icon name={item.icon} fill={theme.navItem} />
        </div>
        <BodyS weight={700} className="nav-item-title">
          {item.name}
        </BodyS>
      </NavLink>
    ))}
  </NavigationStyled>
);
