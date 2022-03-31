import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '@archie/session/hooks/use-session';
import { SessionState } from '@archie/session/context/session-context';

export const ProtectedRoute: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const { sessionState } = useSession();

  if (sessionState === SessionState.INITIALIZING) {
    return (
      <div className="center-box">
        <h2>Loading</h2>
      </div>
    );
  }

  if (sessionState === SessionState.NOT_AUTHENTICATED) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
