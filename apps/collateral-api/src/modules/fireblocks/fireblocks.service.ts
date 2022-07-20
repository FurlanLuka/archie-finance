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
import { ConfigVariables } from '@archie/api/collateral-api/constants';
import { ConfigService } from '@archie-microservices/config';
import { CryptoService } from '@archie-microservices/crypto';
import { AssetList } from '@archie-microservices/api-interfaces/asset_information';
import { UserVaultAccount } from '../user_vault_account/user_vault_account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CollateralWithdrawInitializedDto,
  LiquidateAssetsDto,
} from './fireblocks.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { COLLATERAL_WITHDRAW_TRANSACTION_CREATED_EXCHANGE } from '@archie/api/credit-api/constants';

@Injectable()
export class FireblocksService {
  private fireblocksClient: FireblocksSDK;

  constructor(
    @InjectRepository(UserVaultAccount)
    private userVaultAccountRepository: Repository<UserVaultAccount>,
    private configService: ConfigService,
    private cryptoService: CryptoService,
    private amqpConnection: AmqpConnection,
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

  public async withdrawAsset({
    asset,
    withdrawalAmount,
    userId,
    destinationAddress,
    withdrawalId,
  }: CollateralWithdrawInitializedDto): Promise<CreateTransactionResponse> {
    const assetList: AssetList = this.configService.get(
      ConfigVariables.ASSET_LIST,
    );

    const fireblocksAsset = assetList[asset];

    if (!fireblocksAsset) {
      throw new NotFoundException();
    }

    const userVaultAccount: UserVaultAccount | null =
      await this.userVaultAccountRepository.findOneBy({
        userId,
      });

    if (!userVaultAccount) {
      // TODO handle no vault account or something
      return;
    }

    const transaction = await this.fireblocksClient.createTransaction({
      assetId: fireblocksAsset.fireblocks_id,
      amount: withdrawalAmount,
      source: {
        type: PeerType.VAULT_ACCOUNT,
        id: userVaultAccount.vaultAccountId,
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
    this.amqpConnection.publish(
      COLLATERAL_WITHDRAW_TRANSACTION_CREATED_EXCHANGE.name,
      '',
      {
        withdrawalId,
        transactionId: transaction.id,
      },
    );

    return transaction;
  }

  public async liquidateAssets({
    userId,
    liquidation,
  }: LiquidateAssetsDto): Promise<void> {
    Logger.log({
      code: 'FIREBLOCKS_SERVICE_LIQUIDATION',
      params: {
        userId,
        liquidation,
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

    const userVaultAccount: UserVaultAccount | null =
      await this.userVaultAccountRepository.findOneBy({
        userId,
      });

    if (!userVaultAccount) {
      Logger.error({
        code: 'FIREBLOCKS_SERVICE_LIQUIDATION',
        message: `No user account for userId: ${userId}`,
      });
      throw new NotFoundException();
    }
    await Promise.all(
      liquidation.map(async ({ asset, amount }) => {
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
            id: userVaultAccount.vaultAccountId,
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
      }),
    );
  }
}
