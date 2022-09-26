import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateTransactionResponse,
  DepositAddressResponse,
  FireblocksSDK,
  GenerateAddressResponse,
  PeerType,
  VaultAccountResponse,
  VaultAssetResponse,
} from 'fireblocks-sdk';
import {
  ConfigVariables,
  INTERNAL_COLLATERAL_TRANSACTION_CREATED_TOPIC,
} from '@archie/api/collateral-api/constants';
import { ConfigService } from '@archie/api/utils/config';
import { CryptoService } from '@archie/api/utils/crypto';
import { AssetList } from '@archie/api/collateral-api/asset-information';
import { COLLATERAL_WITHDRAW_TRANSACTION_CREATED_TOPIC } from '@archie/api/credit-api/constants';
import { QueueService } from '@archie/api/utils/queue';
import {
  CollateralWithdrawTransactionCreatedPayload,
  InternalCollateralTransactionCreatedPayload,
} from '@archie/api/collateral-api/data-transfer-objects';
import {
  CollateralLiquidationInitiatedPayload,
  CollateralWithdrawInitializedPayload,
} from '@archie/api/credit-api/data-transfer-objects';

@Injectable()
export class FireblocksService {
  private fireblocksClient: FireblocksSDK;

  constructor(
    private configService: ConfigService,
    private cryptoService: CryptoService,
    private queueService: QueueService,
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

  public async withdrawAsset(
    {
      asset,
      withdrawalAmount,
      destinationAddress,
      withdrawalId,
    }: CollateralWithdrawInitializedPayload,
    vaultAccountId: string,
  ): Promise<CreateTransactionResponse> {
    const assetList: AssetList = this.configService.get(
      ConfigVariables.ASSET_LIST,
    );

    const fireblocksAsset = assetList[asset];

    if (!fireblocksAsset) {
      throw new NotFoundException();
    }

    const transaction = await this.fireblocksClient.createTransaction({
      assetId: fireblocksAsset.fireblocks_id,
      amount: withdrawalAmount,
      source: {
        type: PeerType.VAULT_ACCOUNT,
        id: vaultAccountId,
      },
      destination: {
        type: PeerType.ONE_TIME_ADDRESS,
        oneTimeAddress: {
          address: destinationAddress,
        },
      },
      extraParameters: {
        withdrawalId,
      },
    });
    Logger.log({
      code: 'FIREBLOCKS_SERVICE_CREATED_TRANSACTION',
      transaction,
    });
    this.queueService.publish<CollateralWithdrawTransactionCreatedPayload>(
      COLLATERAL_WITHDRAW_TRANSACTION_CREATED_TOPIC,
      {
        withdrawalId,
        transactionId: transaction.id,
      },
    );

    return transaction;
  }

  public async liquidateAssets(
    { userId, collateral }: CollateralLiquidationInitiatedPayload,
    vaultAccountId: string,
  ): Promise<void> {
    Logger.log({
      code: 'FIREBLOCKS_SERVICE_LIQUIDATION',
      params: {
        userId,
        collateral,
      },
    });
    const internalVaultAccountId = this.configService.get(
      ConfigVariables.FIREBLOCKS_VAULT_ACCOUNT_ID,
    );
    if (!internalVaultAccountId) {
      Logger.error({
        code: 'FIREBLOCKS_SERVICE_LIQUIDATION',
        message: 'Missing FIREBLOCKS_VAULT_ACCOUNT_ID env variable',
      });
      throw new InternalServerErrorException();
    }

    const assetList: AssetList = this.configService.get(
      ConfigVariables.ASSET_LIST,
    );

    await Promise.all(
      collateral.map(async ({ asset, amount, price }) => {
        const fireblocksAsset = assetList[asset];

        if (!fireblocksAsset) {
          Logger.error({
            code: 'FIREBLOCKS_SERVICE_LIQUIDATION',
            message: `Asset ${asset} not in assetList}`,
            asset,
            assetList,
          });
          throw new NotFoundException();
        }

        const transaction = await this.fireblocksClient.createTransaction({
          assetId: fireblocksAsset.fireblocks_id,
          amount: amount,
          source: {
            type: PeerType.VAULT_ACCOUNT,
            id: vaultAccountId,
          },
          destination: {
            type: PeerType.VAULT_ACCOUNT,
            id: internalVaultAccountId,
          },
        });
        Logger.log({
          code: 'FIREBLOCKS_SERVICE_LIQUIDATION_TRANSACTION_CREATED',
          asset,
          transaction,
        });

        this.queueService.publish<InternalCollateralTransactionCreatedPayload>(
          INTERNAL_COLLATERAL_TRANSACTION_CREATED_TOPIC,
          {
            userId,
            id: transaction.id,
            network: fireblocksAsset.network,
            asset,
            amount,
            price,
          },
        );
      }),
    );
  }
}
