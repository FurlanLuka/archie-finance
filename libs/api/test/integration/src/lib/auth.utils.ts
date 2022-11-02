import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { user } from './data-stubs/user.stubs';

export const generateUserAccessToken = (customUser = user): string => {
  return sign({}, 'ACTIONS_SIGNING_SECRET', {
    expiresIn: 300,
    issuer: 'AUTH0_DOMAIN',
    subject: customUser.id,
  });
};

export const verifyAccessToken = (accessToken: string): JwtPayload => {
  return verify(accessToken, 'ACTIONS_SIGNING_SECRET') as JwtPayload;
};
