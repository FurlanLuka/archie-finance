import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PeerType,
  TransactionResponse,
  TransactionStatus,
} from 'fireblocks-sdk';
import { CollateralService } from '../collateral/collateral.service';
import { DepositAddressService } from '../deposit_address/deposit_address.service';
import { FireblocksWebhookDto } from '../fireblocks_webhook/fireblocks_webhook.dto';
import {
  EventType,
  FireblocksWebhookPayload,
} from './fireblocks_webhook.interfaces';
import { ConfigService } from '@archie-microservices/config';
import { ConfigVariables } from '@archie/api/collateral-api/constants';
import { AssetList } from '@archie-microservices/api-interfaces/asset_information';
import { UserVaultAccount } from '../user_vault_account/user_vault_account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FireblocksWebhookService {
  constructor(
    private collateralService: CollateralService,
    private depositAddressService: DepositAddressService,
    private configService: ConfigService,
    @InjectRepository(UserVaultAccount)
    private userVaultAccountRepository: Repository<UserVaultAccount>,
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
    // if withdrawal
    if (payload.data.source.type === PeerType.VAULT_ACCOUNT) {
      await this.handleCollateralWithdraw(payload.data);
    } else {
      // TODO when fireblocks access is a go, make the conditions better
      await this.handleCollateralDeposit(payload.data);
    }
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
        if (assetList[key].fireblocks_id !== transaction.assetId) {
          return [];
        }

        return [key];
      });

      Logger.log({
        code: 'ASSET_INFORMATION',
        ...asset,
      });

      const assetId: string = asset.length > 0 ? asset[0] : transaction.assetId;

      await this.collateralService.createDeposit(
        transaction.id,
        userId,
        assetId,
        transaction.netAmount,
        transaction.destinationAddress,
        transaction.status,
      );
    } catch (error) {
      Logger.error({
        code: 'FIREBLOCKS_WEBHOOK_ERROR',
        metadata: {
          transactionId: transaction.id,
          assetId: transaction.assetId,
          amount: transaction.netAmount,
          destination: transaction.destinationAddress,
          status: transaction.status,
        },
      });

      throw new InternalServerErrorException();
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
        if (assetList[key].fireblocks_id !== transaction.assetId) {
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

      await this.collateralService.createWithdrawal({
        asset: assetId,
        destinationAddress: transaction.destinationAddress,
        status: transaction.status,
        transactionId: transaction.id,
        withdrawalAmount: transaction.amount,
        userId: userVaultAccount.userId,
      });
    } catch (error) {
      Logger.error({
        code: 'FIREBLOCKS_WEBHOOK_WITHDRAW_ERROR',
        metadata: {
          transactionId: transaction.id,
          assetId: transaction.assetId,
          amount: transaction.netAmount,
          destination: transaction.destination,
          destinationAddress: transaction.destinationAddress,
          source: transaction.source,
          status: transaction.status,
        },
      });

      throw new InternalServerErrorException();
    }
  }
}
