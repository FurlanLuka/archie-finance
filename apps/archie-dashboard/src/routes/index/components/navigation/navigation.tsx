import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthenticatedSession } from '@archie/session/hooks/use-session';
import { ParagraphXXS } from '../../../../components/_generic/typography/typography.styled';
import { dashboardNavItems } from '../../../../constants/dashboard-nav-items';

import { NavigationStyled } from './navigation.styled';

export const Navigation: FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthenticatedSession();

  return (
    <NavigationStyled>
      {dashboardNavItems.map((item, index) => (
        <div className="nav-item" key={index} onClick={() => (item.name === 'logout' ? logout : navigate(item.path))}>
          <div className="icon">{item.icon}</div>
          <ParagraphXXS weight={700}>{item.name}</ParagraphXXS>
        </div>
      ))}
    </NavigationStyled>
  );
};
