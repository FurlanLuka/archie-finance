import { Injectable } from '@nestjs/common';
import {
  FireblocksSDK,
  GenerateAddressResponse,
  VaultAccountResponse,
  VaultAssetResponse,
} from 'fireblocks-sdk';
import { ConfigVariables } from '@archie/api/collateral-api/constants';
import { ConfigService } from '@archie/api/utils/config';
import { CryptoService } from '@archie/api/utils/crypto';
import {
  CreateVaultAccountError,
  CreateVaultAssetError,
  GenerateDepositAddressError,
} from './fireblocks_api.errors';

@Injectable()
export class FireblocksApiService {
  private fireblocksClient: FireblocksSDK;

  constructor(
    private configService: ConfigService,
    private cryptoService: CryptoService,
  ) {
    this.fireblocksClient = new FireblocksSDK(
      cryptoService.base64decode(
        this.configService.get(ConfigVariables.FIREBLOCKS_PRIVATE_KEY),
      ),
      this.configService.get(ConfigVariables.FIREBLOCKS_API_KEY),
    );
  }

  public async generateDepositAddress(
    vaultAccountId: string,
    assetId: string,
    userId: string,
  ): Promise<GenerateAddressResponse> {
    const hashedUserId: string = this.cryptoService.sha256(userId);
this.fireblocksClient.createInternalWallet
    try {
      return await this.fireblocksClient.generateNewAddress(
        vaultAccountId,
        assetId,
        undefined,
        hashedUserId,
      );
    } catch (error) {
      throw new GenerateDepositAddressError({
        vaultAccountId,
        assetId,
        userId,
      });
    }
  }

  public async createVaultAccount(
    userId: string,
  ): Promise<VaultAccountResponse> {
    const hashedUserId: string = this.cryptoService.sha256(userId);

    try {
      return await this.fireblocksClient.createVaultAccount(
        hashedUserId,
        false,
        hashedUserId,
        true,
      );
    } catch (error) {
      throw new CreateVaultAccountError({
        userId,
      });
    }
  }

  public async getVaultAccount(
    vaultAccountId: string,
  ): Promise<VaultAccountResponse> {
    return this.fireblocksClient.getVaultAccountById(vaultAccountId);
  }

  public async createVaultAsset(
    vaultAccountId: string,
    asset: string,
  ): Promise<VaultAssetResponse> {
    try {
      return await this.fireblocksClient.createVaultAsset(
        vaultAccountId,
        asset,
      );
    } catch (error) {
      throw new CreateVaultAssetError({
        vaultAccountId,
        asset,
      });
    }
  }
}
