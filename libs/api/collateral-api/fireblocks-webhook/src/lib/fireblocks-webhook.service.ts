import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PeerType,
  TransactionResponse,
  TransactionStatus,
} from 'fireblocks-sdk';
import { DepositAddressService } from '@archie/api/collateral-api/deposit-address';
import {
  FireblocksWebhookDto,
  InternalCollateralTransactionCompletedPayload,
} from './fireblocks-webhook.dto';
import {
  EventType,
  FireblocksWebhookPayload,
} from './fireblocks-webhook.interfaces';
import { ConfigService } from '@archie/api/utils/config';
import {
  ConfigVariables,
  INTERNAL_COLLATERAL_TRANSACTION_COMPLETED_TOPIC,
} from '@archie/api/collateral-api/constants';
import { AssetList } from '@archie/api/collateral-api/asset-information';
import { UserVaultAccount } from '@archie/api/collateral-api/user-vault-account';
import { Repository } from 'typeorm';
import { FireblocksWebhookError } from './fireblocks-webhook.errors';
import {
  COLLATERAL_DEPOSITED_TOPIC,
  COLLATERAL_WITHDRAW_COMPLETED_TOPIC,
} from '@archie/api/credit-api/constants';
import { QueueService } from '@archie/api/utils/queue';
import {
  CollateralDepositedPayload,
  CollateralWithdrawCompletedPayload,
} from '@archie/api/collateral-api/data-transfer-objects';

@Injectable()
export class FireblocksWebhookService {
  constructor(
    private depositAddressService: DepositAddressService,
    private configService: ConfigService,
    @InjectRepository(UserVaultAccount)
    private userVaultAccountRepository: Repository<UserVaultAccount>,
    private queueService: QueueService,
  ) {}

  public async webhookHandler(payload: FireblocksWebhookDto): Promise<void> {
    Logger.log({
      code: 'FIREBLOCKS_WEBHOOK',
      ...payload,
    });

    if (
      payload.type === EventType.TRANSACTION_CREATED ||
      payload.type === EventType.TRANSACTION_STATUS_UPDATED ||
      payload.type === EventType.TRANSACTION_APPROVAL_STATUS_UPDATED
    ) {
      await this.handleTransactionWebhook(payload as FireblocksWebhookPayload);
    }
  }

  private async handleTransactionWebhook(
    payload: FireblocksWebhookPayload,
  ): Promise<void> {
    if (
      payload.data.source.type === PeerType.VAULT_ACCOUNT &&
      payload.data.destination.id ===
        this.configService.get(ConfigVariables.FIREBLOCKS_VAULT_ACCOUNT_ID)
    ) {
      await this.handleInternalCollateralTransaction(payload.data);
    } else if (payload.data.source.type === PeerType.VAULT_ACCOUNT) {
      await this.handleCollateralWithdraw(payload.data);
    } else {
      // TODO when fireblocks access is a go, make the conditions better
      await this.handleCollateralDeposit(payload.data);
    }
  }

  private async handleInternalCollateralTransaction(
    transaction: TransactionResponse,
  ): Promise<void> {
    Logger.log({
      code: 'INTERNAL_COLLATERAL_TRANSACTION',
      transaction: transaction,
    });

    if (transaction.status !== TransactionStatus.COMPLETED) {
      return;
    }

    const userVaultAccount: UserVaultAccount | null =
      await this.userVaultAccountRepository.findOneBy({
        vaultAccountId: transaction.source.id,
      });

    if (userVaultAccount === null) {
      Logger.error({
        code: 'FIREBLOCKS_WEBHOOK_INTERNAL_TRANSACTION_NO_VAULT_ACCOUNT',
      });

      throw new NotFoundException();
    }

    this.queueService.publish<InternalCollateralTransactionCompletedPayload>(
      INTERNAL_COLLATERAL_TRANSACTION_COMPLETED_TOPIC,
      {
        transactionId: transaction.id,
        userId: userVaultAccount.userId,
      },
    );
  }

  private async handleCollateralDeposit(
    transaction: TransactionResponse,
  ): Promise<void> {
    try {
      Logger.log({
        code: 'COLLATERAL_DEPOSIT',
        transaction,
      });
      const userId: string =
        await this.depositAddressService.getUserIdForDepositAddress(
          transaction.destinationAddress,
        );

      const assetList: AssetList = this.configService.get(
        ConfigVariables.ASSET_LIST,
      );

      Logger.log({
        code: 'ASSET_LIST',
        ...assetList,
      });

      const asset: string[] = Object.keys(assetList).flatMap((key) => {
        if (assetList[key]?.fireblocks_id !== transaction.assetId) {
          return [];
        }

        return [key];
      });

      Logger.log({
        code: 'ASSET_INFORMATION',
        ...asset,
      });

      const assetId: string = asset.length > 0 ? asset[0] : transaction.assetId;

      Logger.log({
        code: 'CREATE_COLLATERAL_DEPOSIT',
        ...{
          transactionId: transaction.id,
          userId,
          asset: assetId,
          amount: transaction.netAmount,
          destination: transaction.destinationAddress,
          status: transaction.status,
        },
      });

      this.queueService.publish<CollateralDepositedPayload>(
        COLLATERAL_DEPOSITED_TOPIC,
        {
          transactionId: transaction.id,
          userId,
          asset: assetId,
          amount: transaction.netAmount,
          destination: transaction.destinationAddress,
          status: transaction.status,
        },
      );
    } catch (error) {
      throw new FireblocksWebhookError({
        transactionId: transaction.id,
        assetId: transaction.assetId,
        amount: transaction.netAmount,
        destination: transaction.destinationAddress,
        status: transaction.status,
      });
    }
  }

  private async handleCollateralWithdraw(
    transaction: TransactionResponse,
  ): Promise<void> {
    // TODO add current amount to the database?
    Logger.log({
      code: 'COLLATERAL_WITHDRAW',
      transaction: transaction,
    });
    // don't do anything until it's completed
    if (transaction.status !== TransactionStatus.COMPLETED) {
      return;
    }

    try {
      Logger.log('handling collateral withdraw');
      const userVaultAccount = await this.userVaultAccountRepository.findOneBy({
        vaultAccountId: transaction.source.id,
      });

      if (!userVaultAccount) {
        Logger.error({
          code: 'FIREBLOCKS_WEBHOOK_WITHDRAW_NO_VAULT_ACCOUNT',
        });

        throw new NotFoundException();
      }

      const assetList: AssetList = this.configService.get(
        ConfigVariables.ASSET_LIST,
      );

      Logger.log({
        code: 'FIREBLOCKS_WEBHOOK_WITHDRAW_ASSET_LIST',
        ...assetList,
      });

      const assets: string[] = Object.keys(assetList).flatMap((key) => {
        if (assetList[key]?.fireblocks_id !== transaction.assetId) {
          return [];
        }

        return [key];
      });

      Logger.log({
        code: 'FIREBLOCKS_WEBHOOK_WITHDRAW_ASSET_INFORMATION',
        assets,
      });

      const assetId: string =
        assets.length > 0 ? assets[0] : transaction.assetId;

      Logger.log({
        code: 'FIREBLOCKS_WEBHOOK_WITHDRAW_ASSET_PUBLISH',
        data: {
          asset: assetId,
          destinationAddress: transaction.destinationAddress,
          status: transaction.status,
          transactionId: transaction.id,
          withdrawalAmount: transaction.amount,
          userId: userVaultAccount.userId,
        },
      });

      this.queueService.publish<CollateralWithdrawCompletedPayload>(
        COLLATERAL_WITHDRAW_COMPLETED_TOPIC,
        {
          asset: assetId,
          transactionId: transaction.id,
          userId: userVaultAccount.userId,
        },
      );
    } catch (error) {
      throw new FireblocksWebhookError({
        transactionId: transaction.id,
        assetId: transaction.assetId,
        amount: transaction.netAmount,
        destination: transaction.destination,
        destinationAddress: transaction.destinationAddress,
        source: transaction.source,
        status: transaction.status,
      });
    }
  }
}
