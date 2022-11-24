import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { LedgerRecalculation } from './recalculation.entity';
import { DateTime } from 'luxon';
import {
  HIGH_LTV,
  INITIATE_BATCH_RECALCULATION,
  LOW_LTV,
  MEDIUM_LTV,
} from '@archie/api/ledger-recalculation-scheduler-api/constants';
import { QueueService } from '@archie/api/utils/queue';
import { v4 } from 'uuid';
import { BatchUser } from './batch.entity';
import { Scheduler } from './scheduler.entity';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectRepository(LedgerRecalculation)
    private ledgerRecalculationRepository: Repository<LedgerRecalculation>,
    @InjectRepository(BatchUser)
    private batchUserRepository: Repository<BatchUser>,
    @InjectRepository(Scheduler)
    private schedulerRepository: Repository<Scheduler>,
    private queueService: QueueService,
  ) {}

  BATCH_SIZE = 20;

  public async createInitialUserRecalculation(userId: string): Promise<void> {
    const now = DateTime.now().toISO();

    await this.ledgerRecalculationRepository.save({
      userId,
      ltv: 0,
      recalculationTriggeredAt: now,
      processedAt: now,
    });
  }

  public async handleLedgerRecalculated(batchId: string): Promise<void> {
    console.log('Ledger recaulculated', batchId);
    // set the timestamps accordingly and choose next scheduler entry
  }

  public async initiateBatchRecalculation(): Promise<void> {
    const now = DateTime.now().toISO();

    // TODO get a better way fo getting the total
    const totalLow = await this.ledgerRecalculationRepository.count({
      where: { ltv: LessThanOrEqual(LOW_LTV) },
    });
    const totalMedium = await this.ledgerRecalculationRepository.count({
      where: { ltv: Between(LOW_LTV, MEDIUM_LTV) },
    });
    const totalHigh = await this.ledgerRecalculationRepository.count({
      where: { ltv: Between(MEDIUM_LTV, HIGH_LTV) },
    });
    const totalCritical = await this.ledgerRecalculationRepository.count({
      where: { ltv: MoreThan(HIGH_LTV) },
    });

    const batchCountLow = Math.floor(totalLow / 60);
    const batchCountMedium = Math.floor(totalMedium / 20);
    const batchCountHigh = Math.floor(totalHigh / 10);
    const batchCountCritical = Math.floor(totalCritical / 5);

    const batchLowLtv = await this.ledgerRecalculationRepository.find({
      order: { recalculationTriggeredAt: 'asc' },
      take: batchCountLow,
      select: ['userId'],
    });
    const batchMediumLtv = await this.ledgerRecalculationRepository.find({
      order: { recalculationTriggeredAt: 'asc' },
      take: batchCountMedium,
      select: ['userId'],
    });
    const batchHighLtv = await this.ledgerRecalculationRepository.find({
      order: { recalculationTriggeredAt: 'asc' },
      take: batchCountHigh,
      select: ['userId'],
    });
    const batchCriticalLtv = await this.ledgerRecalculationRepository.find({
      order: { recalculationTriggeredAt: 'asc' },
      take: batchCountCritical,
      select: ['userId'],
    });

    const batchOfUserIds = [
      ...batchLowLtv.map(({ userId }) => userId),
      ...batchMediumLtv.map(({ userId }) => userId),
      ...batchHighLtv.map(({ userId }) => userId),
      ...batchCriticalLtv.map(({ userId }) => userId),
    ];

    let firstBatchId;
    for (let i = 0; i < batchOfUserIds.length; i += this.BATCH_SIZE) {
      const userIds = batchOfUserIds.slice(i, i + this.BATCH_SIZE);
      const batchId = v4();
      if (i === 0) {
        firstBatchId = batchId;
      }

      await this.schedulerRepository.save({
        batchId,
        groupTimestamp: now,
        ltvProcessed: false,
        creditLineProcessed: false,
      });

      await Promise.all(
        userIds.map(async (userId) => {
          await this.batchUserRepository.save({ batchId, userId });
        }),
      );
    }

    // publish batch id
    this.queueService.publishEvent(INITIATE_BATCH_RECALCULATION, {
      userIds: batchOfUserIds,
    });
  }
}
