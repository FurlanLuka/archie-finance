import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AptoApiModule } from './api/apto_api.module';
import { AptoController } from './apto.controller';
import { AptoService } from './apto.service';
import { AptoCard } from './apto_card.entity';
import { AptoCardApplication } from './apto_card_application.entity';
import { AptoUser } from './apto_user.entity';
import { AptoVerification } from './apto_verification.entity';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import {
  CARD_ACTIVATED_EXCHANGE,
  ConfigVariables,
  PHONE_NUMBER_VERIFIED_EXCHANGE,
} from '@archie/api/credit-api/constants';
import { ConfigService, ConfigModule } from '@archie/api/utils/config';
import { CreditModule } from '@archie/api/credit-api/credit';

@Module({
  controllers: [AptoController],
  providers: [AptoService],
  imports: [
    TypeOrmModule.forFeature([
      AptoVerification,
      AptoUser,
      AptoCardApplication,
      AptoCard,
    ]),
    AptoApiModule,
    CreditModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [PHONE_NUMBER_VERIFIED_EXCHANGE, CARD_ACTIVATED_EXCHANGE],
        uri: configService.get(ConfigVariables.QUEUE_URL),
        connectionInitOptions: { wait: false },
      }),
    }),
  ],
})
export class AptoModule {}
