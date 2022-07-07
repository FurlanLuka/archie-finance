import * as React from 'react';

export enum SessionState {
  INITIALIZING,
  REFRESHING,
  AUTHENTICATED,
  NOT_AUTHENTICATED,
}

export interface SessionContextValues {
  sessionState: SessionState;
  setSessionState: React.Dispatch<React.SetStateAction<SessionState>>;
  accessToken: string | undefined;
  setAccessToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  logout: () => void;
}

export const defaultSessionContextValue: SessionContextValues = {
  sessionState: undefined as any,
  accessToken: undefined as any,
  setSessionState: undefined as any,
  setAccessToken: undefined as any,
  logout: undefined as any,
};

export const SessionContext: React.Context<SessionContextValues> =
  React.createContext<SessionContextValues>(defaultSessionContextValue);
