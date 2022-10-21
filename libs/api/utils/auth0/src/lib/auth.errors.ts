import { ForbiddenException } from '@nestjs/common';

export class AccessForbiddenError extends ForbiddenException {
  constructor(scopes: string[]) {
    super({
      statusCode: 403,
      message: 'Forbidden resource',
      missingScopes: scopes,
    });
  }
}
