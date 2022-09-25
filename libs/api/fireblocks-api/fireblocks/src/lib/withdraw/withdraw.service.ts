import { Injectable, Logger } from '@nestjs/common';
import { FireblocksWithdrawTransactionPayload } from '@archie/api/webhook-api/data-transfer-objects';
import { TransactionStatus } from 'fireblocks-sdk';
import { AssetsService } from '@archie/api/fireblocks-api/assets';
import { VaultAccountService } from '../vault-account/vault_account.service';
import { VaultAccount } from '../vault-account/vault_account.entity';
import {
  AssetInformation,
  CollateralWithdrawalCompletedPayload,
} from '@archie/api/fireblocks-api/data-transfer-objects';
import { InjectRepository } from '@nestjs/typeorm';
import { Withdraw } from './withdraw.entity';
import { Repository } from 'typeorm';
import { QueueService } from '@archie/api/utils/queue';
import { COLLATERAL_WITHDRAWAL_COMPLETED_TOPIC } from '@archie/api/fireblocks-api/constants';
import { BigNumber } from 'bignumber.js';

@Injectable()
export class WithdrawService {
  constructor(
    private vaultAccountService: VaultAccountService,
    private assetsService: AssetsService,
    private queueService: QueueService,
    @InjectRepository(Withdraw)
    private withdrawRepository: Repository<Withdraw>,
  ) {}

  public async withdrawalTransactionHandler({
    status,
    sourceVaultId,
    destinationAddress,
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
      this.queueService.publish<CollateralWithdrawalCompletedPayload>(
        COLLATERAL_WITHDRAWAL_COMPLETED_TOPIC,
        {
          userId: vaultAccount.userId,
          assetId: assetInformation.id,
          amount: BigNumber(netAmount.toString())
            .plus(networkFee.toString())
            .toString(),
        },
      );
    }
  }
}
