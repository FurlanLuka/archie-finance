import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { RequestWithUser } from '@archie/api/utils/auth0';
import { AccessForbiddenError } from './auth.errors';
import { Reflector } from '@nestjs/core';

const SCOPES_KEY = 'scopes';

@Injectable()
export class ScopeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const scopes: string[] | undefined = this.reflector.get<string[]>(
      SCOPES_KEY,
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    if (scopes === undefined) {
      return true;
    }

    const missingScopes: string[] = scopes.filter(
      (scope) => !user?.scope.includes(scope) ?? true,
    );

    if (missingScopes.length !== 0) {
      throw new AccessForbiddenError(missingScopes);
    }

    return true;
  }
}

export const Scopes = (...scopes: string[]) => SetMetadata(SCOPES_KEY, scopes);
