import { useAuth0 } from '@auth0/auth0-react';
import { FC, useEffect } from 'react';

export const LogoutRoute: FC = () => {
  const { logout } = useAuth0();

  useEffect(() => {
    logout({
      returnTo: window.location.origin,
    });
  }, [logout]);

  return <></>;
};
