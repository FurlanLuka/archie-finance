import { DynamicModule, Module } from '@nestjs/common';
import {
  RabbitMQExchangeConfig,
  RabbitMQModule,
} from '@golevelup/nestjs-rabbitmq';
import { ConfigVariables } from '@archie/api/credit-api/constants';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { QueueUtilService } from './queue-util.service';
import { RabbitOptions } from './queue.interfaces';
import { QueueService } from './queue.service';

@Module({})
export class QueueModule {
  static register(options?: RabbitOptions): DynamicModule {
    const exchanges: RabbitMQExchangeConfig[] = options?.exchanges ?? [];

    return {
      module: QueueModule,
      imports: [
        RabbitMQModule.forRootAsync(RabbitMQModule, {
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            exchanges: QueueUtilService.createExchanges([
              QueueUtilService.GLOBAL_EXCHANGE,
              ...exchanges,
            ]),
            uri: configService.get(ConfigVariables.QUEUE_URL),
            enableControllerDiscovery: true,
            connectionInitOptions: { wait: false },
          }),
        }),
      ],
      providers: [QueueService],
      exports: [RabbitMQModule, QueueService],
      global: true,
    };
  }
}
