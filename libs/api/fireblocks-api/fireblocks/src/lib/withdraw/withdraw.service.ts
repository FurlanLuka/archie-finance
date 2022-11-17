import { Injectable, Logger } from '@nestjs/common';
import { FireblocksWithdrawTransactionPayload } from '@archie/api/webhook-api/data-transfer-objects';
import {
  CreateTransactionResponse,
  TransactionStatus,
  VaultAccountResponse,
} from 'fireblocks-sdk';
import {
  AssetInformation,
  AssetsService,
} from '@archie/api/fireblocks-api/assets';
import { VaultAccountService } from '../vault-account/vault_account.service';
import { VaultAccount } from '../vault-account/vault_account.entity';
import {
  CollateralWithdrawalTransactionUpdatedStatus,
  InitiateCollateralWithdrawalCommandPayload,
} from '@archie/api/fireblocks-api/data-transfer-objects/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Withdraw } from './withdraw.entity';
import { Repository } from 'typeorm';
import { QueueService } from '@archie/api/utils/queue';
import {
  COLLATERAL_WITHDRAWAL_TRANSACTION_ERROR_TOPIC,
  COLLATERAL_WITHDRAWAL_TRANSACTION_SUBMITTED_TOPIC,
  COLLATERAL_WITHDRAWAL_TRANSACTION_UPDATED_TOPIC,
} from '@archie/api/fireblocks-api/constants';

@Injectable()
export class WithdrawService {
  constructor(
    private vaultAccountService: VaultAccountService,
    private assetsService: AssetsService,
    private queueService: QueueService,
    @InjectRepository(Withdraw)
    private withdrawRepository: Repository<Withdraw>,
  ) {}

  public async initiateCollateralWithdrawalCommandHandler({
    userId,
    assetId,
    amount,
    internalTransactionId,
    destinationAddress,
  }: InitiateCollateralWithdrawalCommandPayload): Promise<void> {
    try {
      const vaultAccount: VaultAccountResponse =
        await this.vaultAccountService.getOrCreateVaultAccount(userId);

      const createTransactioResponse: CreateTransactionResponse =
        await this.vaultAccountService.createWithdrawalTransaction(
          vaultAccount.id,
          assetId,
          amount,
          destinationAddress,
          internalTransactionId,
        );

      this.queueService.publishEvent(
        COLLATERAL_WITHDRAWAL_TRANSACTION_SUBMITTED_TOPIC,
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
        COLLATERAL_WITHDRAWAL_TRANSACTION_ERROR_TOPIC,
        {
          userId,
          assetId,
          amount,
          internalTransactionId,
        },
      );
    }
  }

  public async withdrawalTransactionHandler({
    status,
    sourceVaultId,
    destinationAddress,
    internalTransactionId,
    assetId,
    transactionId,
    netAmount,
    networkFee,
  }: FireblocksWithdrawTransactionPayload): Promise<void> {
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

    await this.withdrawRepository.save({
      userId: vaultAccount.userId,
      transactionId,
      sourceVaultId,
      destinationAddress,
      assetId: assetInformation.id,
      status,
      amount: netAmount.toString(),
      fee: networkFee.toString(),
    });

    if (status === TransactionStatus.COMPLETED) {
      this.queueService.publishEvent(
        COLLATERAL_WITHDRAWAL_TRANSACTION_UPDATED_TOPIC,
        {
          userId: vaultAccount.userId,
          assetId: assetInformation.id,
          amount: netAmount.toString(),
          networkFee: networkFee.toString(),
          transactionId,
          internalTransactionId,
          status: CollateralWithdrawalTransactionUpdatedStatus.COMPLETED,
        },
      );
    } else if (status === TransactionStatus.BROADCASTING) {
      this.queueService.publishEvent(
        COLLATERAL_WITHDRAWAL_TRANSACTION_UPDATED_TOPIC,
        {
          userId: vaultAccount.userId,
          assetId: assetInformation.id,
          amount: netAmount.toString(),
          networkFee: networkFee.toString(),
          internalTransactionId,
          transactionId,
          status: CollateralWithdrawalTransactionUpdatedStatus.IN_PROGRESS,
        },
      );
    } else if (
      status === TransactionStatus.BLOCKED ||
      status === TransactionStatus.CANCELLED ||
      status === TransactionStatus.REJECTED ||
      status === TransactionStatus.FAILED
    ) {
      this.queueService.publishEvent(
        COLLATERAL_WITHDRAWAL_TRANSACTION_ERROR_TOPIC,
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
