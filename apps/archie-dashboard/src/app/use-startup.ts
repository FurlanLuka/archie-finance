import { useEffect, useState } from 'react';

import { SessionState, useSession } from '@archie-webapps/shared/data-access/session';
import { websocketInstance } from '@archie-webapps/shared/data-access/websocket-instance';

interface UseStartupResult {
  initialized: boolean;
}

export const useStartup = (): UseStartupResult => {
  const { sessionState, accessToken } = useSession();
  const [initialized, setInitialized] = useState(false);
  useEffect(() => {
    if (sessionState === SessionState.NOT_AUTHENTICATED) {
      setInitialized(true);
    }

    if (sessionState === SessionState.AUTHENTICATED && accessToken !== undefined) {
      websocketInstance.setToken(accessToken);
      websocketInstance.connect(() => {
        setInitialized(true);
      });
    }
  }, [sessionState, accessToken]);

  return { initialized };
};
