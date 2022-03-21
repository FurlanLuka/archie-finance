import { useAuth0 } from '@auth0/auth0-react';
import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="center-box">
        <h2>Loading</h2>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
