import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DepositAddressModule } from '../deposit_address/deposit_address.module';
import { FireblocksWebhookController } from './fireblocks_webhook.controller';
import { FireblocksWebhookService } from './fireblocks_webhook.service';
import { FireblocksWebhookStrategy } from './guard/fireblocks_webhook.strategy';
import { CryptoModule } from '@archie-microservices/crypto';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@archie-microservices/config';
import { ConfigVariables } from '@archie/api/collateral-api/constants';
import { COLLATERAL_DEPOSITED_EXCHANGE } from '@archie/api/credit-api/constants';

@Module({
  imports: [
    PassportModule,
    DepositAddressModule,
    CryptoModule,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [COLLATERAL_DEPOSITED_EXCHANGE],
        uri: configService.get(ConfigVariables.QUEUE_URL),
        connectionInitOptions: { wait: false },
      }),
    }),
  ],
  providers: [FireblocksWebhookService, FireblocksWebhookStrategy],
  controllers: [FireblocksWebhookController],
})
export class FireblocksWebhookModule {}
