import { DynamicModule, Module, OnModuleInit } from '@nestjs/common';
import {
  AmqpConnection,
  RabbitHandlerConfig,
  RabbitMQExchangeConfig,
  RabbitMQModule,
} from '@golevelup/nestjs-rabbitmq';
import { DiscoveryService } from '@golevelup/nestjs-discovery';
import { RABBIT_RETRY_HANDLER } from './utils';

import { ConfigVariables } from '@archie/api/credit-api/constants';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { QueueUtilService } from './queue-util.service';
import { RabbitOptions } from './queue.interfaces';
import { QueueService } from './queue.service';

@Module({})
export class QueueModule implements OnModuleInit {
  constructor(
    private amqpConnection: AmqpConnection,
    private discover: DiscoveryService,
  ) {}

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

  async onModuleInit() {
    const retryHandlers = [
      ...(await this.discover.providerMethodsWithMetaAtKey<RabbitHandlerConfig>(
        RABBIT_RETRY_HANDLER,
      )),
      ...(await this.discover.controllerMethodsWithMetaAtKey<RabbitHandlerConfig>(
        RABBIT_RETRY_HANDLER,
      )),
    ];
    retryHandlers.forEach(({ discoveredMethod, meta }) => {
      const handler = discoveredMethod.handler.bind(
        discoveredMethod.parentClass.instance,
      );
      console.log(meta);

      this.amqpConnection.createSubscriber(
        handler,
        meta,
        discoveredMethod.methodName,
      );
    });
  }
}
