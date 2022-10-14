import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventLog } from './event_log.entity';
import { Idempotency } from './event_idempotency.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(EventLog)
    private eventLogRepository: Repository<EventLog>,
    @InjectRepository(Idempotency)
    private idempotencyRepository: Repository<Idempotency>,
  ) {}

  public async writeEventLog(
    eventId: string,
    eventMessage: object,
  ): Promise<void> {
    try {
      await this.eventLogRepository.insert({
        id: eventId,
        message: eventMessage,
        timestamp: Date.now(),
      });
    } catch {
      Logger.error(`Error writing event log for id ${eventId}`);
    }
  }

  public async writeIdempotencyKey(id: string): Promise<void> {
    try {
      await this.idempotencyRepository.insert({
        id,
        timestamp: Date.now(),
      });
    } catch {
      Logger.error(`Error writing idempotency key for: ${id}`);
    }
  }

  public async idempotencyKeyExists(id: string): Promise<boolean> {
    try {
      const record: Idempotency | null =
        await this.idempotencyRepository.findOneBy({
          id,
        });

      return record !== null;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }
}
