import { DynamicModule, Logger, Module, Provider } from '@nestjs/common';
import {
  RabbitMQExchange,
  RabbitMQModule,
} from 'nestjs-rabbit-messaging-queue';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { QueueConstants } from './queue.constants';
import { QueueOptions } from './queue.interfaces';
import { QueueService } from './queue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idempotency } from '../log/event_idempotency.entity';
import { EventLog } from '../log/event_log.entity';
import { LogService } from '../log/log.service';
import { RmqModule } from 'nestjs-rabbit-messaging-queue';

@Module({})
export class QueueModule {
  static register(options?: QueueOptions): DynamicModule {
    const exchanges: RabbitMQExchange[] = options?.exchanges ?? [];
    const useEventLog = options?.useEventLog ?? true;

    const imports = [
      RmqModule.register({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const queueUrl = configService.get('QUEUE_URL');

          if (queueUrl === undefined) {
            throw new Error('REQUIRED_QUEUE_VARIABLES_MISSING');
          }

          return {
            exchanges: [QueueConstants.GLOBAL_EXCHANGE, ...exchanges],
            uri: queueUrl,
            prefetchCount: 250,
            enableControllerDiscovery: true,
            connectionInitOptions: { wait: false },
            logger: new Logger(),
          };
        },
      }),
    ];

    const providers: Provider[] = [
      {
        provide: 'USE_EVENT_LOG',
        useValue: useEventLog,
      },
      QueueService,
    ];

    const exports: Provider[] = [RmqModule, QueueService];

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
