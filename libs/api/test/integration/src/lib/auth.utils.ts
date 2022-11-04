import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { user } from './stubs/user.stubs';
import { AuthScopes } from '@archie/api/utils/auth0';
import { v4 } from 'uuid';

export const generateUserAccessToken = (
  customUser = user,
  scopes: AuthScopes[] = [],
): string => {
  return sign(
    {
      scope: scopes.join(' '),
      _ensureUniq: v4(),
    },
    'ACTIONS_SIGNING_SECRET',
    {
      expiresIn: 300,
      issuer: 'AUTH0_DOMAIN',
      subject: customUser.id,
    },
  );
};

export const verifyAccessToken = (accessToken: string): JwtPayload => {
  return verify(accessToken, 'ACTIONS_SIGNING_SECRET') as JwtPayload;
};
