import { useState } from 'react';
import useAsyncEffect from 'use-async-effect';

import { SessionState, useSession } from '@archie-webapps/shared/data-access/session';
import { websocketInstance } from '@archie-webapps/shared/data-access/websocket-instance';

interface UseStartupResult {
  isInitialized: boolean;
  showLimitedToast: boolean;
}

export const useStartup = (): UseStartupResult => {
  const { sessionState, accessToken } = useSession();
  const [isInitialized, setIsInitialized] = useState(false);
  const [showLimitedToast, setShowLimitedToast] = useState(false);

  useAsyncEffect(async () => {
    const handleConnect = () => {
      setIsInitialized(true);
      setShowLimitedToast(false);
    };

    const handleFail = () => {
      setShowLimitedToast(true);
      setIsInitialized(true);
    };

    if (sessionState === SessionState.NOT_AUTHENTICATED) {
      setIsInitialized(true);
    }

    if (sessionState === SessionState.AUTHENTICATED && accessToken !== undefined) {
      websocketInstance.setToken(accessToken);
      await websocketInstance.connect(handleConnect, handleFail);
    }
  }, [sessionState, accessToken]);

  return { isInitialized, showLimitedToast };
};
