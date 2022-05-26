import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DepositAddressResponse, VaultAccountResponse } from 'fireblocks-sdk';
import { Repository } from 'typeorm';
import { FireblocksService } from '../fireblocks/fireblocks.service';
import { UserVaultAccount } from './user_vault_account.entity';

@Injectable()
export class UserVaultAccountService {
  constructor(
    @InjectRepository(UserVaultAccount)
    private userVaultAccount: Repository<UserVaultAccount>,
    private fireblocksService: FireblocksService,
  ) {}

  public async getUserVaultAccount(
    userId: string,
  ): Promise<VaultAccountResponse> {
    const userVaultAccount: UserVaultAccount | undefined =
      await this.userVaultAccount.findOne({
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
}
