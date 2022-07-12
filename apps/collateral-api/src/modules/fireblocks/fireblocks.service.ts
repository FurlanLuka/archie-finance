import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  DepositAddressResponse,
  FireblocksSDK,
  GenerateAddressResponse,
  PeerType,
  VaultAccountResponse,
  VaultAssetResponse,
} from 'fireblocks-sdk';
import { ConfigVariables } from '@archie/api/collateral-api/constants';
import { ConfigService } from '@archie-microservices/config';
import { CryptoService } from '@archie-microservices/crypto';
import { AssetList } from '@archie-microservices/api-interfaces/asset_information';
import { UserVaultAccountService } from '../user_vault_account/user_vault_account.service';

@Injectable()
export class FireblocksService {
  private fireblocksClient: FireblocksSDK;

  constructor(
    private userVaultAccountService: UserVaultAccountService,
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

  // Subscribed to COLLATERAL_WITHDRAW_INITIALIZED_EXCHANGE
  public async withdrawAsset({
    asset,
    withdrawalAmount,
    userId,
    destinationAddress,
  }: {
    asset: string;
    withdrawalAmount: number;
    userId: string;
    destinationAddress: string;
  }): Promise<void> {
    const assetList: AssetList = this.configService.get(
      ConfigVariables.ASSET_LIST,
    );

    Logger.log({
      code: 'ASSET_LIST',
      ...assetList,
    });

    const fireblocksAsset = assetList[asset];

    if (!fireblocksAsset) {
      throw new NotFoundException();
    }

    // TODO event based this?
    const userVaultAccount =
      await this.userVaultAccountService.getUserVaultAccount(userId);

    if (!userVaultAccount) {
      // TODO handle no vault account or something
      return;
    }

    Logger.log({
      code: 'ASSET_INFORMATION',
      ...fireblocksAsset,
    });

    const transaction = await this.fireblocksClient.createTransaction({
      assetId: fireblocksAsset.fireblocks_id,
      amount: withdrawalAmount,
      source: {
        type: PeerType.VAULT_ACCOUNT,
        id: userVaultAccount.id,
      },
      destination: {
        type: PeerType.ONE_TIME_ADDRESS,
        oneTimeAddress: {
          address: destinationAddress,
        },
      },
    });
    Logger.log({
      code: 'FIREBLOCKS_SERVICE_CREATED_TRANSACTION',
      transaction,
    });
  }
}
