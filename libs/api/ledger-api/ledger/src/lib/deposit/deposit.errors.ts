import { BadRequestException } from '@nestjs/common';

export class InvalidAssetError extends BadRequestException {
  metadata: object;

  constructor(metadata: object) {
    super('INVALID_ASSET');
    this.metadata = metadata;
  }
}
