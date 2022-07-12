import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FireblocksService } from './fireblocks.service';
import { CryptoModule } from '@archie-microservices/crypto';
import { UserVaultAccount } from '../user_vault_account/user_vault_account.entity';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@archie-microservices/config';
import { COLLATERAL_WITHDRAW_INITIALIZED_EXCHANGE } from '@archie/api/credit-api/constants';
import { ConfigVariables } from '@archie/api/collateral-api/constants';
import { FireblocksQueueController } from './fireblocks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    PassportModule,
    CryptoModule,
    TypeOrmModule.forFeature([UserVaultAccount]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [COLLATERAL_WITHDRAW_INITIALIZED_EXCHANGE],
        uri: configService.get(ConfigVariables.QUEUE_URL),
        connectionInitOptions: { wait: false },
        enableControllerDiscovery: true,
        connectionManagerOptions: {
          heartbeatIntervalInSeconds: 10,
        },
      }),
    }),
  ],
  providers: [FireblocksService],
  exports: [FireblocksService],
  controllers: [FireblocksQueueController],
})
export class FireblocksModule {}
