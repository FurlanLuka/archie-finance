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
  DEFAULT_MAX_LOCK_DURATION_IN_MS = 60000;

  constructor(@Inject('CONFIG_OPTIONS') private options: RedisConfig) {}

  onModuleInit(): void {
    this.redisClient = new Client(this.options.url);
    this.redlock = new Redlock([this.redisClient], {
      retryCount: this.NO_RETRY,
    });
  }

  public async setWithExpiry(
    key: string,
    value: string,
    expirySeconds: number,
    keyPrefix = this.options.keyPrefix,
  ): Promise<void> {
    const prefixedKey = `${keyPrefix}_${key}`;

    await this.redisClient.setex(prefixedKey, expirySeconds, value);
  }

  public async get(
    key: string,
    keyPrefix = this.options.keyPrefix,
  ): Promise<string | null> {
    const prefixedKey = `${keyPrefix}_${key}`;

    return this.redisClient.get(prefixedKey);
  }

  public async getAndDelete(
    key: string,
    keyPrefix = this.options.keyPrefix,
  ): Promise<string | null> {
    const prefixedKey = `${keyPrefix}_${key}`;

    return this.redisClient.getdel(prefixedKey);
  }

  public async acquireLock(
    resources: string[],
    duration = this.DEFAULT_MAX_LOCK_DURATION_IN_MS,
  ): Promise<RedlockLock> {
    const prefixedResources: string[] = resources.map(
      (resource): string =>
        `${this.options.keyPrefix}_${Math.random()}_${resource}`,
    );

    return this.redlock.acquire(prefixedResources, duration);
  }

  public async releaseLock(lock: RedlockLock): Promise<void> {
    await lock.release();
  }
}

export function Lock(
  resourceNameCallBack: (payload: unknown) => string | string[],
): MethodDecorator {
  const injector = Inject(RedisService);

  return (
    target: object,
    _key?: string | symbol,
    descriptor?: PropertyDescriptor,
  ) => {
    if (descriptor === undefined) {
      Logger.warn('Incorrect decorator usage, descriptor is undefined');
      return;
    }

    injector(target, 'redisService');

    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]): Promise<unknown> {
      const redisService: RedisService = this.redisService;
      let lock: RedlockLock;

      try {
        const resourceNames: string | string[] = resourceNameCallBack(args[0]);
        const resources: string[] =
          typeof resourceNames === 'string' ? [resourceNames] : resourceNames;

        lock = await redisService.acquireLock(resources);
      } catch (error) {
        if (error instanceof ExecutionError) {
          throw new LockedResourceError();
        }

        throw error;
      }

      try {
        const response: unknown = await originalMethod.apply(this, args);
        return response;
      } finally {
        await redisService.releaseLock(lock);
      }
      return;
    };
  };
}
