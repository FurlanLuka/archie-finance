import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CollateralLiquidationTransactionErrorPayload,
  CollateralLiquidationTransactionSubmittedPayload,
  CollateralLiquidationTransactionUpdatedPayload,
  CollateralLiquidationTransactionUpdatedStatus,
  InitiateCollateralLiquidationCommandPayload,
} from '@archie/api/fireblocks-api/data-transfer-objects';
import { Liquidation } from './liquidation.entity';
import {
  CreateTransactionResponse,
  TransactionStatus,
  VaultAccountResponse,
} from 'fireblocks-sdk';
import { VaultAccountService } from '../vault-account/vault_account.service';
import {
  COLLATERAL_LIQUIDATION_TRANSACTION_ERROR_TOPIC,
  COLLATERAL_LIQUIDATION_TRANSACTION_SUBMITTED_TOPIC,
  COLLATERAL_LIQUIDATION_TRANSACTION_UPDATED_TOPIC,
} from '@archie/api/fireblocks-api/constants';
import { QueueService } from '@archie/api/utils/queue';
import { FireblocksInternalTransactionPayload } from '@archie/api/webhook-api/data-transfer-objects';
import { VaultAccount } from '../vault-account/vault_account.entity';
import {
  AssetInformation,
  AssetsService,
} from '@archie/api/fireblocks-api/assets';

@Injectable()
export class LiquidationService {
  constructor(
    @InjectRepository(Liquidation)
    private liquidationRepository: Repository<Liquidation>,
    private vaultAccountService: VaultAccountService,
    private queueService: QueueService,
    private assetsService: AssetsService,
  ) {}

  public async initiateCollateralLiquidationCommandHandler({
    userId,
    assetId,
    amount,
    internalTransactionId,
  }: InitiateCollateralLiquidationCommandPayload): Promise<void> {
    try {
      const vaultAccount: VaultAccountResponse =
        await this.vaultAccountService.getOrCreateVaultAccount(userId);

      const createTransactioResponse: CreateTransactionResponse =
        await this.vaultAccountService.createLiquidationTransaction(
          vaultAccount.id,
          assetId,
          amount,
          internalTransactionId,
        );

      this.queueService.publishEvent(
        COLLATERAL_LIQUIDATION_TRANSACTION_SUBMITTED_TOPIC,
        {
          userId,
          assetId,
          amount,
          internalTransactionId,
          transactionId: createTransactioResponse.id,
        },
      );
    } catch (error) {
      this.queueService.publishEvent(
        COLLATERAL_LIQUIDATION_TRANSACTION_ERROR_TOPIC,
        {
          userId,
          assetId,
          amount,
          internalTransactionId,
        },
      );
    }
  }

  public async liquidationTransactionHandler({
    status,
    sourceVaultId,
    destinationVaultId,
    internalTransactionId,
    assetId,
    transactionId,
    netAmount,
    networkFee,
  }: FireblocksInternalTransactionPayload): Promise<void> {
    const vaultAccount: VaultAccount =
      await this.vaultAccountService.getVaultAccount(sourceVaultId);

    const assetInformation: AssetInformation | undefined =
      this.assetsService.getAssetInformationForFireblocksId(assetId);

    if (assetInformation === undefined) {
      Logger.error({
        code: 'UNSUPPORTED_ASSET',
        transactionId: transactionId,
        assetId: assetId,
        userId: vaultAccount.userId,
      });

      return;
    }

    await this.liquidationRepository.save({
      userId: vaultAccount.userId,
      transactionId,
      sourceVaultId,
      destinationVaultId,
      assetId: assetInformation.id,
      status,
      amount: netAmount.toString(),
      fee: networkFee.toString(),
    });

    if (status === TransactionStatus.COMPLETED) {
      this.queueService.publishEvent(
        COLLATERAL_LIQUIDATION_TRANSACTION_UPDATED_TOPIC,
        {
          userId: vaultAccount.userId,
          assetId: assetInformation.id,
          amount: netAmount.toString(),
          networkFee: networkFee.toString(),
          transactionId,
          internalTransactionId,
          status: CollateralLiquidationTransactionUpdatedStatus.COMPLETED,
        },
      );
    } else if (status === TransactionStatus.BROADCASTING) {
      this.queueService.publishEvent(
        COLLATERAL_LIQUIDATION_TRANSACTION_UPDATED_TOPIC,
        {
          userId: vaultAccount.userId,
          assetId: assetInformation.id,
          amount: netAmount.toString(),
          networkFee: networkFee.toString(),
          internalTransactionId,
          transactionId,
          status: CollateralLiquidationTransactionUpdatedStatus.IN_PROGRESS,
        },
      );
    } else if (
      status === TransactionStatus.BLOCKED ||
      status === TransactionStatus.CANCELLED ||
      status === TransactionStatus.REJECTED ||
      status === TransactionStatus.FAILED
    ) {
      this.queueService.publishEvent(
        COLLATERAL_LIQUIDATION_TRANSACTION_ERROR_TOPIC,
        {
          userId: vaultAccount.userId,
          assetId: assetInformation.id,
          amount: netAmount.toString(),
          internalTransactionId,
          transactionId,
        },
      );
    }
  }
}
