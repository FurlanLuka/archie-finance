import { ForbiddenException } from '@nestjs/common';

export class AccessForbiddenError extends ForbiddenException {
  requiredScopes: string[];

  constructor(scopes: string[]) {
    super({
      statusCode: 403,
      message: 'FORBIDDEN_RESOURCE_ACCESS',
      error:
        'Missing scopes. Please try again with token that contains all required scopes.',
      requiredScopes: scopes,
    });
  }
}
