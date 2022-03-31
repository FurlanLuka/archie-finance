import { useAuth0 } from '@auth0/auth0-react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { SessionContext, SessionState } from './session-context';

interface SessionProviderProps {
  onLogout: () => void;
}

export const SessionContextProvider: React.FC<
  PropsWithChildren<SessionProviderProps>
> = (props: PropsWithChildren<SessionProviderProps>) => {
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [sessionState, setSessionState] = useState(SessionState.INITIALIZING);

  const { getAccessTokenSilently, logout } = useAuth0();

  useEffect(() => {
    if (
      sessionState === SessionState.INITIALIZING ||
      sessionState === SessionState.REFRESHING
    ) {
      getAccessTokenSilently()
        .then((accessToken) => {
          setAccessToken(accessToken);
          setSessionState(SessionState.AUTHENTICATED);
        })
        .catch(() => {
          setSessionState(SessionState.NOT_AUTHENTICATED);
        });
    }
  }, [sessionState]);

  return (
    <SessionContext.Provider
      value={{
        accessToken,
        setAccessToken,
        sessionState,
        setSessionState,
        logout,
      }}
    >
      {props.children}
    </SessionContext.Provider>
  );
};
