import { FC } from 'react';
import { NavLink } from 'react-router-dom';

import { dashboardNavItems } from '@archie/ui/dashboard/constants';
import { BodyS } from '@archie/ui/shared/design-system';
import { Icon } from '@archie/ui/shared/icons';
import { theme } from '@archie/ui/shared/theme';

import { NavigationStyled } from './navigation.styled';

export const Navigation: FC = () => (
  <NavigationStyled>
    {dashboardNavItems.map((item, index) => (
      <NavLink key={index} to={item.path} end={item.end} className="nav-item">
        {({ isActive }) => (
          <>
            <div className="nav-item-icon">
              <Icon
                name={item.icon}
                fill={isActive ? theme.navItemActive : theme.navItem}
              />
            </div>
            <BodyS
              color={isActive ? theme.navItemActive : theme.navItem}
              weight={700}
            >
              {item.name}
            </BodyS>
          </>
        )}
      </NavLink>
    ))}
  </NavigationStyled>
);
