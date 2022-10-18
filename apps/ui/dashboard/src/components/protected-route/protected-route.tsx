import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

import {
  SessionState,
  useSession,
} from '@archie-microservices/ui/shared/data-access/session';
import { LoaderFullScreen } from '@archie-microservices/ui/shared/ui/design-system';

export const ProtectedRoute: React.FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const { sessionState } = useSession();

  if (sessionState === SessionState.INITIALIZING) {
    return <LoaderFullScreen />;
  }

  if (sessionState === SessionState.NOT_AUTHENTICATED) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
