import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LedgerRecalculation } from './recalculation.entity';
import { DateTime } from 'luxon';

@Injectable()
export class SchedulerService {
  constructor(
    @InjectRepository(LedgerRecalculation)
    private ledgerRecalculationRepository: Repository<LedgerRecalculation>,
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
}
