import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthConfig } from './auth.interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'auth0-auth') {
  constructor(@Inject('AUTH_OPTIONS') private authOptions: AuthConfig) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${authOptions.domain}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: authOptions.audience,
      issuer: `${authOptions.domain}/`,
      algorithms: ['RS256'],
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate(payload: any, done: VerifiedCallback): void {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!payload) {
      done(new UnauthorizedException(), false);
    }

    return done(null, payload);
  }
}
