import { useAuth0 } from '@auth0/auth0-react';
import { PropsWithChildren } from 'react';

export const ProtectedRoute: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return <div className='center-box'><h2>Loading</h2></div>
  }

  if (!isAuthenticated) {
    loginWithRedirect();

    return <></>
  }

  return <>{children}</>;
};
