import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreditLimit } from '../credit_limit.entity';
import { CollateralBalanceUpdateUtilService } from '../utils/collateral_balance_update.service';
import { CREDIT_LIMIT_PERIODIC_CHECK_REQUESTED } from '@archie/api/credit-limit-api/constants';
import { QueueService } from '@archie/api/utils/queue';
import { CreditLimitPeriodicCheckRequestedPayload } from '@archie/api/credit-limit-api/data-transfer-objects';

@Injectable()
export class PeriodicCheckService {
  constructor(
    @InjectRepository(CreditLimit)
    private creditLimitRepository: Repository<CreditLimit>,
    private collateralBalanceUpdateUtilService: CollateralBalanceUpdateUtilService,
    private queueService: QueueService,
  ) {}

  public async handlePeriodicCreditLimitCheck(
    userIds: string[],
  ): Promise<void> {
    await this.collateralBalanceUpdateUtilService.handlePeriodicCollateralBalanceUpdate(
      userIds,
    );
  }

  public async triggerPeriodicCheck(): Promise<void> {
    const QUEUE_EVENTS_LIMIT = 5000;

    const creditLimits: CreditLimit[] = await this.creditLimitRepository.find();

    const userIds: string[] = creditLimits.map((credit) => credit.userId);

    const chunkSize: number = Math.ceil(userIds.length / QUEUE_EVENTS_LIMIT);

    for (let i = 0; i < userIds.length; i += chunkSize) {
      const userIdChunk: string[] = userIds.slice(i, i + chunkSize);

      this.queueService.publish<CreditLimitPeriodicCheckRequestedPayload>(
        CREDIT_LIMIT_PERIODIC_CHECK_REQUESTED,
        {
          userIds: userIdChunk,
        },
      );
    }
  }
}
