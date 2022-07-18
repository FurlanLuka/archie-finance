import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export class DepositAddressUnknownAssetError extends NotFoundException {
  metadata: object;

  constructor(metadata: object) {
    super('DEPOSIT_ADDRESS_UNKNOWN_ASSET');
    this.metadata = metadata;
  }
}

export class GeneratePersonalWalletInternalError extends InternalServerErrorException {
  metadata: object;

  constructor(metadata: object) {
    super('GENERATE_PERSONAL_WALLET_ERROR');
    this.metadata = metadata;
  }
}

export class GenerateOmnubusWalletInternalError extends InternalServerErrorException {
  metadata: object;

  constructor(metadata: object) {
    super('GENERATE_OMNIBUS_WALLET_ERROR');
    this.metadata = metadata;
  }
}
