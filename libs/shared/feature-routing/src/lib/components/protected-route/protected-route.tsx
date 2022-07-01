import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import { SessionState, useSession } from '@archie-webapps/shared/data-access-session';
import { Loading } from '@archie-webapps/ui-design-system';

export const ProtectedRoute: React.FC<PropsWithChildren<unknown>> = ({ children }) => {
  const { sessionState } = useSession();

  if (sessionState === SessionState.INITIALIZING) {
    return <Loading />;
  }

  if (sessionState === SessionState.NOT_AUTHENTICATED) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
