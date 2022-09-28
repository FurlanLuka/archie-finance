import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import Client from 'ioredis';
import Redlock from 'redlock';
import { RedisConfig, Lock } from './redis.interfaces';

@Injectable()
export class RedisService implements OnModuleInit {
  private redisClient: Client;
  private redlock: Redlock;
  private NO_RETRY = 0;
  DEFAULT_MAX_LOCK_DURATION_IN_MS = 30000;

  constructor(@Inject('CONFIG_OPTIONS') private options: RedisConfig) {}

  onModuleInit(): void {
    this.redisClient = new Client(this.options.url);
    this.redlock = new Redlock([this.redisClient], {
      retryCount: this.NO_RETRY,
    });
  }

  public async acquireLock(
    resource: string,
    duration = this.DEFAULT_MAX_LOCK_DURATION_IN_MS,
  ): Promise<Lock> {
    const prefixedKey = `${this.options.keyPrefix}_${resource}`;

    return this.redlock.acquire([prefixedKey], duration);
  }

  public async releaseLock(lock: Lock): Promise<void> {
    await lock.release();
  }
}
