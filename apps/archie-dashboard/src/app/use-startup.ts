import { useState } from 'react';
import useAsyncEffect from 'use-async-effect';

import { SessionState, useSession } from '@archie-webapps/shared/data-access/session';
import { websocketInstance } from '@archie-webapps/shared/data-access/websocket-instance';

interface UseStartupResult {
  initialized: boolean;
}

export const useStartup = (): UseStartupResult => {
  const { sessionState, accessToken } = useSession();
  const [initialized, setInitialized] = useState(false);
  useAsyncEffect(async () => {
    if (sessionState === SessionState.NOT_AUTHENTICATED) {
      setInitialized(true);
    }

    if (sessionState === SessionState.AUTHENTICATED && accessToken !== undefined) {
      websocketInstance.setToken(accessToken);
      await websocketInstance.connect();
      // still initialize the app if it fails?
      setInitialized(true);
    }
  }, [sessionState, accessToken]);

  return { initialized };
};
