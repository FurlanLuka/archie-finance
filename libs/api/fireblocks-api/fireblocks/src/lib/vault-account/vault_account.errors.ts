import { NotFoundException } from '@nestjs/common';

export class UnknownAssetError extends NotFoundException {
  metadata: object;

  constructor(metadata: object) {
    super('UNKNOWN_ASSET');
    this.metadata = metadata;
  }
}

export class DepositAddressNotFoundError extends NotFoundException {
  metadata: object;

  constructor(metadata: object) {
    super('DEPOSIT_ADDRESS_NOT_FOUND');
    this.metadata = metadata;
  }
}

export class VaultAccountNotFoundError extends NotFoundException {
  metadata: object;

  constructor(metadata: object) {
    super('VAULT_ACCOUNT_NOT_FOUND');
    this.metadata = metadata;
  }
}
