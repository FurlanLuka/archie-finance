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

@Injectable()
export class SchedulerService {
  constructor(
    @InjectRepository(LedgerRecalculation)
    private ledgerRecalculationRepository: Repository<LedgerRecalculation>,
    private queueService: QueueService,
  ) {}

  public async createInitialUserRecalculation(userId: string): Promise<void> {
    const now = DateTime.now().toISO();

    await this.ledgerRecalculationRepository.save({
      userId,
      ltv: 0,
      recalculationTriggeredAt: now,
      processedAt: now,
    });
  }

  public async recalculateLedger(userIds: string[]): Promise<void> {
    console.log('recalculating for', userIds);
  }

  public async getBatchOfUsers(): Promise<void> {
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

    this.queueService.publishEvent(INITIATE_BATCH_RECALCULATION, {
      userIds: batchOfUserIds,
    });
  }
}
