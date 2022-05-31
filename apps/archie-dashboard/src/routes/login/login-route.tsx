import { FC, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const LoginRoute: FC = () => {
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    loginWithRedirect();
  }, [loginWithRedirect]);

  return <></>;
};
