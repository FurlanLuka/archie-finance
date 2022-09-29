import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Client from 'ioredis';
import Redlock, { Lock as RedlockLock, ExecutionError } from 'redlock';
import { RedisConfig } from './redis.interfaces';
import { LockedResourceError } from './redis.errors';

@Injectable()
export class RedisService implements OnModuleInit {
  private redisClient: Client;
  private redlock: Redlock;
  private NO_RETRY = 0;
  DEFAULT_MAX_LOCK_DURATION_IN_MS = 30000;

  private activeLocks: RedlockLock[] = [];

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
  ): Promise<string> {
    const prefixedKey = `${this.options.keyPrefix}_${resource}`;

    const lock: RedlockLock = await this.redlock.acquire(
      [prefixedKey],
      duration,
    );
    this.activeLocks.push(lock);

    return prefixedKey;
  }

  public async releaseLock(resource: string): Promise<void> {
    const lock: RedlockLock | undefined = this.activeLocks.find((activeLock) =>
      activeLock.resources.includes(resource),
    );

    if (lock !== undefined) {
      this.activeLocks = this.activeLocks.filter(
        (activeLock) => !activeLock.resources.includes(resource),
      );

      await lock.release();
    }
  }
}

export function Lock(
  resourceNameCallBack: (payload: unknown) => string,
): MethodDecorator {
  const injector = Inject(RedisService);

  return (
    target: any,
    _key?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    if (descriptor === undefined) {
      Logger.warn('Incorrect decorator usage, descriptor is undefined');
      return;
    }

    injector(target, 'redisService');

    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let lockedResource: string;

      try {
        lockedResource = await this.redisService.acquireLock(
          resourceNameCallBack(args[0]),
        );
      } catch (error) {
        if (error instanceof ExecutionError) {
          throw new LockedResourceError();
        }

        throw error;
      }

      try {
        const response = await originalMethod.apply(this, args);
        return response;
      } finally {
        await this.redisService.releaseLock(lockedResource);
      }
    };
  };
}
