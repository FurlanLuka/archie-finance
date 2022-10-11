import { DynamicModule, Logger, Module } from '@nestjs/common';
import {
  RabbitMQExchangeConfig,
  RabbitMQModule,
} from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { QueueUtilService } from './queue-util.service';
import { QueueOptions } from './queue.interfaces';
import { QueueService } from './queue.service';
import {
  DynamodbConfig,
  DynamodbModule,
} from '@archie-microservices/api/utils/dynamodb';

@Module({})
export class QueueModule {
  static register(options?: QueueOptions): DynamicModule {
    const exchanges: RabbitMQExchangeConfig[] = options?.exchanges ?? [];

    const imports = [
      RabbitMQModule.forRootAsync(RabbitMQModule, {
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const queueUrl = configService.get('QUEUE_URL');

          if (queueUrl === undefined) {
            throw new Error('REQUIRED_QUEUE_VARIABLES_MISSING');
          }

          return {
            exchanges: QueueUtilService.createExchanges([
              QueueUtilService.GLOBAL_EXCHANGE,
              ...exchanges,
            ]),
            uri: queueUrl,
            enableControllerDiscovery: true,
            connectionInitOptions: { wait: false },
            logger: new Logger(),
          };
        },
      }),
    ];

    if (options?.includeDynamoDB) {
      imports.push(
        DynamodbModule.register({
          imports: [],
          inject: [ConfigService],
          useFactory: (configService: ConfigService): DynamodbConfig => {
            const accessKeyId = configService.get('DYNAMO_ACCESS_KEY_ID');
            const region = configService.get('DYNAMO_REGION');
            const accessKeySecret = configService.get(
              'DYNAMO_ACCESS_KEY_SECRET',
            );

            if (
              accessKeyId === undefined ||
              accessKeySecret === undefined ||
              region === undefined
            ) {
              throw new Error('REQUIRED_QUEUE_DYNAMODB_VARIABLES_MISSING');
            }
            return {
              accessKeyId,
              accessKeySecret,
              region,
            };
          },
        }),
      );
    }

    return {
      module: QueueModule,
      imports: [...imports],
      providers: [QueueService],
      exports: [RabbitMQModule, QueueService],
      global: true,
    };
  }
}
