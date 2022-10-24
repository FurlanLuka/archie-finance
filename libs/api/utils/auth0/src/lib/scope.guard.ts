import {
  CanActivate,
  CustomDecorator,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { RequestWithUser } from './auth.interfaces';
import { AccessForbiddenError } from './auth.errors';
import { Reflector } from '@nestjs/core';
import { RedisService } from '@archie/api/utils/redis';
import { CryptoService } from '@archie/api/utils/crypto';

const SCOPES_KEY = 'scopes';
export const SCOPE_GUARD_PREFIX = 'scope-guard-';

export enum AuthScopes {
  mfa = 'mfa',
}

@Injectable()
export class ScopeGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private redisService: RedisService,
    private cryptoService: CryptoService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const scopes: string[] | undefined = this.reflector.get<
      string[] | undefined
    >(SCOPES_KEY, context.getHandler());

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (user === undefined) {
      return false;
    }

    if (scopes === undefined || scopes.length === 0) {
      return true;
    }

    const hashedToken = this.cryptoService.sha256(
      request.headers['authorization'],
    );
    const tokenAlreadyUsed: boolean =
      (await this.redisService.get(hashedToken, SCOPE_GUARD_PREFIX)) !== null;

    const missingScopes: string[] = scopes.filter(
      (scope) => !user.scope.includes(scope),
    );

    if (missingScopes.length > 0 || tokenAlreadyUsed) {
      throw new AccessForbiddenError(scopes);
    }

    const currentTimestamp = Date.now() / 1000;
    const tokenExpiresAfter = user.exp - currentTimestamp;

    await this.redisService.setWithExpiry(
      hashedToken,
      'true',
      tokenExpiresAfter,
      SCOPE_GUARD_PREFIX,
    );

    return true;
  }
}

export const Scopes = (...scopes: AuthScopes[]): CustomDecorator =>
  SetMetadata(SCOPES_KEY, scopes);
