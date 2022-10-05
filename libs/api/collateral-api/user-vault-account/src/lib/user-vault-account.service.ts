import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepositAddressResponse, VaultAccountResponse } from 'fireblocks-sdk';
import { Repository } from 'typeorm';
import { FireblocksService } from '@archie/api/collateral-api/fireblocks';
import { UserVaultAccount } from './user-vault-account.entity';
import {
  CollateralLiquidationInitiatedPayload,
  CollateralWithdrawInitializedPayload,
} from '@archie/api/credit-api/data-transfer-objects';
@Injectable()
export class UserVaultAccountService {
  constructor(
    @InjectRepository(UserVaultAccount)
    private userVaultAccount: Repository<UserVaultAccount>,
    private fireblocksService: FireblocksService,
  ) {}

  // TODO split create and get? using this in withdrawals makes creation of an empty vault account a bit iffy
  public async getUserVaultAccount(
    userId: string,
  ): Promise<VaultAccountResponse> {
    const userVaultAccount: UserVaultAccount | null =
      await this.userVaultAccount.findOneBy({
        userId,
      });

    if (!userVaultAccount) {
      const createVaultAccountResponse: VaultAccountResponse =
        await this.fireblocksService.createVaultAccount(userId);

      // LOG THIS !!!IMPORTANT (might be an issue if this fails)

      await this.userVaultAccount.save({
        userId,
        vaultAccountId: createVaultAccountResponse.id,
      });

      return createVaultAccountResponse;
    }

    return this.fireblocksService.getVaultAccount(
      userVaultAccount.vaultAccountId,
    );
  }

  public async createVaultWallet(
    asset: string,
    userId: string,
  ): Promise<string> {
    const userVaultAccount: VaultAccountResponse =
      await this.getUserVaultAccount(userId);

    const depositAddresses: DepositAddressResponse[] =
      await this.fireblocksService.getDepositAddresses(
        userVaultAccount.id,
        asset,
      );

    if (depositAddresses.length > 0) {
      return depositAddresses[0].address;
    }

    const createVaultAssetResponse =
      await this.fireblocksService.createVaultAsset(userVaultAccount.id, asset);

    return createVaultAssetResponse.address;
  }

  public async withdrawAsset(
    collateralWithdrawInitialized: CollateralWithdrawInitializedPayload,
  ): Promise<void> {
    const userVaultAccount: UserVaultAccount | null =
      await this.userVaultAccount.findOneBy({
        userId: collateralWithdrawInitialized.userId,
      });

    if (!userVaultAccount) {
      // TODO handle no vault account or something
      return;
    }

    await this.fireblocksService.withdrawAsset(
      collateralWithdrawInitialized,
      userVaultAccount.vaultAccountId,
    );
  }

  public async liquidateAssets(
    assetsToLiquidate: CollateralLiquidationInitiatedPayload,
  ): Promise<void> {
    const userVaultAccount: UserVaultAccount | null =
      await this.userVaultAccount.findOneBy({
        userId: assetsToLiquidate.userId,
      });

    if (!userVaultAccount) {
      Logger.error({
        code: 'FIREBLOCKS_SERVICE_LIQUIDATION',
        message: `No user account for userId: ${assetsToLiquidate.userId}`,
      });
      throw new NotFoundException();
    }

    await this.fireblocksService.liquidateAssets(
      assetsToLiquidate,
      userVaultAccount.vaultAccountId,
    );
  }
}
