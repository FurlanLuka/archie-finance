import { AuthToken } from './auth.interfaces';

export class AuthTokenDto implements AuthToken {
  authToken: string;
}
