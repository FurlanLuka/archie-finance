import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoModule } from '@archie/api/utils/crypto';
import { WaitlistService } from './waitlist.service';
import { WaitlistController } from './waitlist.controller';
import { Waitlist } from './waitlist.entity';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import {
  ConfigVariables,
  JOINED_WAITLIST_EXCHANGE,
  APPLIED_TO_WAITLIST_EXCHANGE,
} from '@archie/api/referral-system-api/constants';
import { QueueModule, QueueService } from '@archie/api/utils/queue';

@Module({
  imports: [
    TypeOrmModule.forFeature([Waitlist]),
    CryptoModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        encryptionKey: configService.get(ConfigVariables.ENCRYPTION_KEY),
      }),
    }),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule, QueueModule],
      inject: [ConfigService, QueueService],
      useFactory: (
        configService: ConfigService,
        queueService: QueueService,
      ) => ({
        exchanges: queueService.createExchanges([
          JOINED_WAITLIST_EXCHANGE,
          APPLIED_TO_WAITLIST_EXCHANGE,
        ]),
        uri: configService.get(ConfigVariables.QUEUE_URL),
        connectionInitOptions: { wait: false },
      }),
    }),
  ],
  providers: [WaitlistService],
  controllers: [WaitlistController],
})
export class WaitlistModule {}
