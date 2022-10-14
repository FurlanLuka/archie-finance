export interface Auth0Log {
  data: {
    details: {
      query: {
        user_id: string;
        email: string;
      };
    };
    type: string;
  };
}

export interface Auth0Logs {
  logs: Auth0Log[];
}

export enum Auth0Events {
  EMAIL_VERIFIED = 'sv',
  MFA_ENROLLED = 'gd_enrollment_complete',
}
