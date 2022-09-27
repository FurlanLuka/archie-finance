import { SERVICE_QUEUE_NAME } from '@archie/api/ledger-api/constants';
import { Subscribe } from '@archie/api/utils/queue';
import { COLLATERAL_DEPOSIT_TRANSACTION_COMPLETED_TOPIC } from '@archie/api/fireblocks-api/constants';
import { CollateralDepositTransactionCompletedPayload } from '@archie/api/fireblocks-api/data-transfer-objects';
import { LedgerService } from '../ledger/ledger.service';
import { Controller } from '@nestjs/common';

@Controller()
export class DepositQueueController {
  private static CONTROLLER_QUEUE_NAME = `${SERVICE_QUEUE_NAME}-ledger`;

  constructor(private ledgerService: LedgerService) {}

  @Subscribe(
    COLLATERAL_DEPOSIT_TRANSACTION_COMPLETED_TOPIC,
    DepositQueueController.CONTROLLER_QUEUE_NAME,
  )
  async depositHandler({
    userId,
    assetId,
    amount,
  }: CollateralDepositTransactionCompletedPayload): Promise<void> {
    await this.ledgerService.incrementLedgerAccount(userId, assetId, amount);
  }
}
