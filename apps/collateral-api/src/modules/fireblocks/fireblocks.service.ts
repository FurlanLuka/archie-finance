import { Injectable } from '@nestjs/common';
import {
  DepositAddressResponse,
  FireblocksSDK,
  GenerateAddressResponse,
  VaultAccountResponse,
  VaultAssetResponse,
} from 'fireblocks-sdk';
import { ConfigVariables } from '@archie/api/collateral-api/constants';
import { ConfigService } from '@archie-microservices/config';
import { CryptoService } from '@archie-microservices/crypto';

@Injectable()
export class FireblocksService {
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
    const encodedUserId: string = this.cryptoService.sha256(userId);

    return this.fireblocksClient.generateNewAddress(
      vaultAccountId,
      assetId,
      undefined,
      encodedUserId,
    );
  }

  public async getDepositAddresses(
    vaultAccountId: string,
    assetId: string,
  ): Promise<DepositAddressResponse[]> {
    return this.fireblocksClient.getDepositAddresses(vaultAccountId, assetId);
  }

  public async createVaultAccount(
    userId: string,
  ): Promise<VaultAccountResponse> {
    const encodedUserId: string = this.cryptoService.sha256(userId);

    return this.fireblocksClient.createVaultAccount(
      encodedUserId,
      false,
      encodedUserId,
      true,
    );
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
    return this.fireblocksClient.createVaultAsset(vaultAccountId, asset);
  }

  public async getVaultAccounts(): Promise<VaultAccountResponse[]> {
    return this.fireblocksClient.getVaultAccounts();
  }

  public async createExternalWallet({
    userId,
    name,
  }: {
    userId: string;
    name: string;
  }): Promise<string> {
    const externalWallet = await this.fireblocksClient.createExternalWallet(
      name,
      userId,
    );

    return externalWallet.id;
  }
}
