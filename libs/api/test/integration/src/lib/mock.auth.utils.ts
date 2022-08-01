import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { user } from './stubs/user.stubs';

export const generateUserAccessToken = () => {
  return sign({}, process.env.ACTIONS_SIGNING_SECRET, {
    expiresIn: 300,
    issuer: process.env.AUTH0_DOMAIN,
    subject: user.id,
  });
};

export const verifyAccessToken = (accessToken: string): JwtPayload => {
  return verify(accessToken, process.env.ACTIONS_SIGNING_SECRET) as JwtPayload;
};
