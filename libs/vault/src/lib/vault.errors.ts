import { InternalServerErrorException } from '@nestjs/common';

export class VaultAuthenticationInternalError extends InternalServerErrorException {
  metadata: object;

  constructor(metadata: object) {
    super('VAULT_AUTHENTICATION_ERROR');
    this.metadata = metadata;
  }
}
