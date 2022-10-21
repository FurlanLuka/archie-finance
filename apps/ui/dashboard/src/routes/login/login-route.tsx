import { useAuth0 } from '@auth0/auth0-react';
import { FC, useEffect } from 'react';

export const LoginRoute: FC = () => {
  const { loginWithRedirect } = useAuth0();

  useEffect(() => {
    loginWithRedirect();
  }, [loginWithRedirect]);

  return <></>;
};
