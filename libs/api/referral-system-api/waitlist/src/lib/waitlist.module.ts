import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoModule } from '@archie/api/utils/crypto';
import { WaitlistService } from './waitlist.service';
import { InternalWaitlistController, WaitlistController } from './waitlist.controller';
import { Waitlist } from './waitlist.entity';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@archie-microservices/config';
import {
  ConfigVariables,
  JOINED_WAITLIST_EXCHANGE,
  APPLIED_TO_WAITLIST_EXCHANGE,
} from '@archie/api/referral-system-api/constants';

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
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [JOINED_WAITLIST_EXCHANGE, APPLIED_TO_WAITLIST_EXCHANGE],
        uri: configService.get(ConfigVariables.QUEUE_URL),
        connectionInitOptions: { wait: false },
      }),
    }),
  ],
  providers: [WaitlistService],
  controllers: [WaitlistController, InternalWaitlistController],
})
export class WaitlistModule {}
