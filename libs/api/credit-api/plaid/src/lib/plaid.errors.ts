import { BadRequestException } from '@nestjs/common';

export class PublicTokenExpiredException extends BadRequestException {
  constructor() {
    super('PUBLIC_TOKEN_EXPIRED');
  }
}
