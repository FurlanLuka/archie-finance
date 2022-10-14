import { DynamicModule, Logger, Module, Provider } from '@nestjs/common';
import {
  RabbitMQExchangeConfig,
  RabbitMQModule,
} from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { QueueUtilService } from './queue-util.service';
import { QueueOptions } from './queue.interfaces';
import { QueueService } from './queue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idempotency } from '../log/event_idempotency.entity';
import { EventLog } from '../log/event_log.entity';
import { LogService } from '../log/log.service';

@Module({})
export class QueueModule {
  static register(options?: QueueOptions): DynamicModule {
    const exchanges: RabbitMQExchangeConfig[] = options?.exchanges ?? [];
    const useEventLog = options?.useEventLog ?? true;

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

    const providers: Provider<any>[] = [
      {
        provide: 'USE_EVENT_LOG',
        useValue: useEventLog,
      },
      QueueService,
    ];

    const exports: any[] = [RabbitMQModule, QueueService];

    if (useEventLog) {
      imports.push(TypeOrmModule.forFeature([EventLog, Idempotency]));
      providers.push(LogService);
      exports.push(LogService);
    }

    return {
      module: QueueModule,
      imports,
      providers,
      exports,
      global: true,
    };
  }
}
