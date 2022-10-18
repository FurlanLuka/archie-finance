import { IsArray } from "class-validator";

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

export class Auth0Logs {
  @IsArray()
  logs: Auth0Log[];
}

export enum Auth0Events {
  EMAIL_VERIFIED = 'sv',
  MFA_ENROLLED = 'gd_enrollment_complete',
}
