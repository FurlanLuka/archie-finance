import { NotFoundException } from '@nestjs/common';

export class AssetNotFoundError extends NotFoundException {
  metadata: object;

  constructor(metadata: object) {
    super('ASSET_NOT_FOUND');
    this.metadata = metadata;
  }
}
