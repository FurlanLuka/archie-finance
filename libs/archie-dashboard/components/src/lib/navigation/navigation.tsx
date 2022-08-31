import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { dashboardNavItems } from '@archie-webapps/archie-dashboard/constants';
import { useAuthenticatedSession } from '@archie-webapps/shared/data-access/session';
import { BodyS } from '@archie-webapps/shared/ui/design-system';
import { Icon } from '@archie-webapps/shared/ui/icons';

import { NavigationStyled } from './navigation.styled';

export const Navigation: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthenticatedSession();

  return (
    <NavigationStyled>
      {dashboardNavItems.map((item, index) => (
        <div className="nav-item" key={index} onClick={() => (item.name === 'logout' ? logout : navigate(item.path))}>
          <div className="nav-item-icon">
            <Icon name={item.icon} />
          </div>
          <BodyS weight={700} className="nav-item-title">
            {item.name}
          </BodyS>
        </div>
      ))}
    </NavigationStyled>
  );
};
