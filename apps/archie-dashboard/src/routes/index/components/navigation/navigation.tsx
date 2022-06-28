import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticatedSession } from '@archie/session/hooks/use-session';
import { ParagraphXXS } from '@archie-webapps/ui-design-system';
import { dashboardNavItems } from '@archie-webapps/util-constants';

import { NavigationStyled } from './navigation.styled';
import { Icon } from '@archie-webapps/ui-icons';

export const Navigation: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthenticatedSession();

  return (
    <NavigationStyled>
      {dashboardNavItems.map((item, index) => (
        <div className="nav-item" key={index} onClick={() => (item.name === 'logout' ? logout : navigate(item.path))}>
          <div className="icon">
            <Icon name={item.icon} />
          </div>
          <ParagraphXXS weight={700}>{item.name}</ParagraphXXS>
        </div>
      ))}
    </NavigationStyled>
  );
};
