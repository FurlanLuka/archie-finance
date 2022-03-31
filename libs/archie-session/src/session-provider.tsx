import { Auth0Provider } from '@auth0/auth0-react';
import { PropsWithChildren } from 'react';
import { SessionContextProvider } from './context/session-context-provider';

interface SessionProviderProps {
  domain: string;
  clientId: string;
  audience: string;
  redirectUri: string;
  onLogout: () => void;
}

export const SessionProvider: React.FC<
  PropsWithChildren<SessionProviderProps>
> = ({ children, domain, clientId, audience, redirectUri, onLogout }) => {
  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      audience={audience}
      redirectUri={redirectUri}
    >
      <SessionContextProvider onLogout={onLogout}>
        {children}
      </SessionContextProvider>
    </Auth0Provider>
  );
};
