import { BadRequestException } from '@nestjs/common';

export class PublicTokenExpiredException extends BadRequestException {
  constructor() {
    super('PUBLIC_TOKEN_EXPIRED');
  }
}

export class AccessTokenUsedException extends BadRequestException {
  constructor() {
    super('ACCESS_TOKEN_USED');
  }
}
