import { InternalServerErrorException } from '@nestjs/common';

export class GenerateDepositAddressError extends InternalServerErrorException {
  metadata: object;

  constructor(metadata: object) {
    super('GENERATE_DEPOSIT_ADDRESS_ERROR');
    this.metadata = metadata;
  }
}

export class CreateVaultAccountError extends InternalServerErrorException {
  metadata: object;

  constructor(metadata: object) {
    super('CREATE_VAULT_ACCOUNT_ERROR');
    this.metadata = metadata;
  }
}

export class CreateVaultAssetError extends InternalServerErrorException {
  metadata: object;

  constructor(metadata: object) {
    super('CREATE_VAULT_ASSET_ERROR');
    this.metadata = metadata;
  }
}
