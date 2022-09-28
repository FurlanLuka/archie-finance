import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateTransactionResponse,
  VaultAccountResponse,
} from 'fireblocks-sdk';
import { Repository } from 'typeorm';
import { VaultAccount } from './vault_account.entity';
import { DepositAddress } from './deposit_address.entity';
import {
  AssetInformation,
  AssetsService,
} from '@archie/api/fireblocks-api/assets';
import { GetDepositAddressResponse } from '@archie/api/fireblocks-api/data-transfer-objects';
import {
  DepositAddressNotFoundError,
  UnknownAssetError,
  VaultAccountNotFoundError,
} from './vault_account.errors';
import { FireblocksApiService } from '../api/fireblocks_api.service';

@Injectable()
export class VaultAccountService {
  constructor(
    @InjectRepository(VaultAccount)
    private vaultAccountRepository: Repository<VaultAccount>,
    @InjectRepository(DepositAddress)
    private depositAddressRepository: Repository<DepositAddress>,
    private fireblocksApiService: FireblocksApiService,
    private assetsService: AssetsService,
  ) {}

  public async createVaultAccount(
    userId: string,
  ): Promise<VaultAccountResponse> {
    const createVaultAccountResponse: VaultAccountResponse =
      await this.fireblocksApiService.createVaultAccount(userId);

    await this.vaultAccountRepository.save({
      userId,
      vaultAccountId: createVaultAccountResponse.id,
    });

    return createVaultAccountResponse;
  }

  public async getOrCreateVaultAccount(
    userId: string,
  ): Promise<VaultAccountResponse> {
    const vaultAccount: VaultAccount | null =
      await this.vaultAccountRepository.findOneBy({
        userId,
      });

    if (vaultAccount) {
      return this.fireblocksApiService.getVaultAccount(
        vaultAccount.vaultAccountId,
      );
    }

    return this.createVaultAccount(userId);
  }

  public async createDepositAddress(
    assetId: string,
    userId: string,
  ): Promise<string> {
    const vaultAccount: VaultAccountResponse =
      await this.getOrCreateVaultAccount(userId);

    const assetInformation: AssetInformation | undefined =
      this.assetsService.getAssetInformation(assetId);

    if (assetInformation === undefined) {
      throw new UnknownAssetError({
        assetId,
      });
    }

    const createVaultAssetResponse =
      await this.fireblocksApiService.createVaultAsset(
        vaultAccount.id,
        assetId,
      );

    await this.depositAddressRepository.save({
      userId,
      asset: assetId,
      address: createVaultAssetResponse.address,
    });

    return createVaultAssetResponse.address;
  }

  public async getOrCreateDepositAddress(
    assetId: string,
    userId: string,
  ): Promise<GetDepositAddressResponse> {
    const depositAddress: DepositAddress | null =
      await this.depositAddressRepository.findOneBy({
        asset: assetId,
        userId,
      });

    if (depositAddress === null) {
      const createDepositAddressResponse: string =
        await this.createDepositAddress(assetId, userId);

      return {
        address: createDepositAddressResponse,
        asset: assetId,
      };
    }

    return {
      address: depositAddress.address,
      asset: assetId,
    };
  }

  public async getUserIdForDepositAddress(
    depositAddress: string,
  ): Promise<string> {
    const record: DepositAddress | null =
      await this.depositAddressRepository.findOneBy({
        address: depositAddress,
      });

    if (record === null) {
      throw new DepositAddressNotFoundError({
        address: depositAddress,
      });
    }

    return record.userId;
  }

  public async getVaultAccount(vaultAccountId: string): Promise<VaultAccount> {
    const vaultAccount: VaultAccount | null =
      await this.vaultAccountRepository.findOneBy({
        vaultAccountId,
      });

    if (vaultAccount === null) {
      throw new VaultAccountNotFoundError({
        vaultAccountId,
      });
    }

    return vaultAccount;
  }

  public async createWithdrawalTransaction(
    vaultAccountId: string,
    assetId: string,
    amount: string,
    destinationAddress: string,
    internalTransactionId: string,
  ): Promise<CreateTransactionResponse> {
    return this.fireblocksApiService.createOutboundTransaction(
      assetId,
      amount,
      destinationAddress,
      internalTransactionId,
      vaultAccountId,
    );
  }

  public async createLiquidationTransaction(
    vaultAccountId: string,
    assetId: string,
    amount: string,
    internalTransactionId: string,
  ): Promise<CreateTransactionResponse> {
    const assetInformation: AssetInformation | undefined =
      this.assetsService.getAssetInformation(assetId);

    if (assetInformation === undefined) {
      throw new UnknownAssetError({
        assetId,
      });
    }

    return this.fireblocksApiService.createInternalTransaction(
      assetId,
      amount,
      assetInformation.liquidationVaultId,
      internalTransactionId,
      vaultAccountId,
    );
  }
}
