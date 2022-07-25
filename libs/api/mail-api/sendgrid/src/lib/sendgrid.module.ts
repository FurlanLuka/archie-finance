import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { SendgirdQueueController } from './sendgrid.controller';
import { SendgridService } from './sendgrid.service';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/mail-api/constants';
import { EmailDataFactoryModule } from '@archie/api/mail-api/utils/email-data-factory';
import { CryptoModule } from '@archie/api/utils/crypto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './contact.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact]),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get(ConfigVariables.QUEUE_URL),
        connectionInitOptions: { wait: false },
        enableControllerDiscovery: true,
        connectionManagerOptions: {
          heartbeatIntervalInSeconds: 10,
        },
      }),
    }),
    CryptoModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        encryptionKey: configService.get(ConfigVariables.ENCRYPTION_KEY),
      }),
    }),
    EmailDataFactoryModule,
  ],
  controllers: [SendgirdQueueController],
  providers: [SendgridService],
  exports: [SendgridService],
})
export class SendgridModule {}
