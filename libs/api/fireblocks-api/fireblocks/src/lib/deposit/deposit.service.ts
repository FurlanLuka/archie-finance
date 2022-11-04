import { Injectable, Logger } from '@nestjs/common';
import { FireblocksDepositTransactionPayload } from '@archie/api/webhook-api/data-transfer-objects';
import { VaultAccountService } from '../vault-account/vault_account.service';
import { AssetInformation, AssetsService } from '@archie/api/fireblocks-api/assets';
import { TransactionStatus } from 'fireblocks-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { Deposit } from './deposit.entity';
import { Repository } from 'typeorm';
import { QueueService } from '@archie/api/utils/queue';
import { COLLATERAL_DEPOSIT_TRANSACTION_COMPLETED_TOPIC } from '@archie/api/fireblocks-api/constants';

@Injectable()
export class DepositService {
  constructor(
    private vaultAccountService: VaultAccountService,
    private assetsService: AssetsService,
    private queueService: QueueService,
    @InjectRepository(Deposit) private depositRepository: Repository<Deposit>,
  ) {}

  public async depositTransactionHandler({
    status,
    sourceAddress,
    destinationAddress,
    assetId,
    transactionId,
    netAmount,
    networkFee,
  }: FireblocksDepositTransactionPayload): Promise<void> {
    if (status !== TransactionStatus.COMPLETED) {
      return;
    }

    const userId: string = await this.vaultAccountService.getUserIdForDepositAddress(destinationAddress);

    const assetInformation: AssetInformation | undefined =
      this.assetsService.getAssetInformationForFireblocksId(assetId);

    if (assetInformation === undefined) {
      Logger.error({
        code: 'UNSUPPORTED_ASSET',
        transactionId: transactionId,
        assetId: assetId,
        userId,
      });

      return;
    }

    await this.depositRepository.save({
      userId,
      transactionId,
      sourceAddress,
      destinationAddress,
      assetId: assetInformation.id,
      amount: netAmount.toString(),
      fee: networkFee.toString(),
    });

    this.queueService.publishEvent(COLLATERAL_DEPOSIT_TRANSACTION_COMPLETED_TOPIC, {
      userId,
      assetId: assetInformation.id,
      amount: netAmount.toString(),
    });
  }
}
