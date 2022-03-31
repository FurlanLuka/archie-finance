import { useContext } from 'react';
import {
  SessionContext,
  SessionContextValues,
  SessionState,
} from '../context/session-context';

export type UseSessionResponse = SessionContextValues;

export const useSession = (): UseSessionResponse => {
  return useContext(SessionContext);
};

interface UseAuthenticatedSession extends UseSessionResponse {
  accessToken: string;
}

export const useAuthenticatedSession = (): UseAuthenticatedSession => {
  const sessionContext = useContext(SessionContext);

  if (
    sessionContext.sessionState === SessionState.NOT_AUTHENTICATED ||
    sessionContext.sessionState === SessionState.INITIALIZING
  ) {
    throw new Error('INVALID_SESSION_STATE');
  }

  return sessionContext as UseAuthenticatedSession;
};
