import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoModule } from '@archie-microservices/crypto';
import { WaitlistService } from './waitlist.service';
import { WaitlistController } from './waitlist.controller';
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
    CryptoModule,
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
  controllers: [WaitlistController],
})
export class WaitlistModule {}
