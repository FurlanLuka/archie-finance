import { Injectable, OnModuleInit } from '@nestjs/common';
import Client from 'ioredis';
import Redlock, { Lock } from 'redlock';

@Injectable()
export class RedisService implements OnModuleInit {
  private redisClient: Client;
  private redlock: Redlock;

  DEFAULT_MAX_LOCK_DURATION_IN_MS = 30000;

  onModuleInit(): void {
    // TODO: accept service prefix
    this.redisClient = new Client();
    this.redlock = new Redlock([this.redisClient], {
      retryCount: 0,
      retryDelay: 200,
      retryJitter: 200,
    });
  }

  public async acquireLock(
    resource: string,
    duration = this.DEFAULT_MAX_LOCK_DURATION_IN_MS,
  ): Promise<Lock> {
    return this.redlock.acquire([resource], duration);
  }

  public async releaseLock(lock: Lock): Promise<void> {
    await lock.release();
  }
}
