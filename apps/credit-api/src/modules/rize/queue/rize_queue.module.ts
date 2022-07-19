import { RizeQueueQueueController } from './rize_queue.controller.module';
import { RizeQueueService } from './rize_queue.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  CARD_ACTIVATED_EXCHANGE,
  TRANSFER_RIZE_EXCHANGE,
} from '@archie/api/credit-api/constants';

@Module({
  controllers: [RizeQueueQueueController],
  providers: [RizeQueueService],
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [TRANSFER_RIZE_EXCHANGE],
        uri: configService.get(ConfigVariables.QUEUE_URL),
        connectionInitOptions: { wait: false },
      }),
    }),
    RizeApiModule,
  ],
})
export class RizeModule {}
