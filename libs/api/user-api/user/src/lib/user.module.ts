import { Module } from '@nestjs/common';
import { Auth0Module } from '@archie/api/user-api/auth0';
import { InternalUserController, UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import {
  ConfigVariables,
  EMAIL_VERIFIED_EXCHANGE,
  MFA_ENROLLED_EXCHANGE,
} from '@archie/api/user-api/constants';
import {
  QueueModule,
  QueueService,
  RabbitMQCustomModule,
} from '@archie/api/utils/queue';
@Module({
  imports: [
    Auth0Module,
    RabbitMQCustomModule.forRootAsync(RabbitMQCustomModule, {
      imports: [ConfigModule, QueueModule],
      inject: [ConfigService, QueueService],
      useFactory: (
        configService: ConfigService,
        queueService: QueueService,
      ) => ({
        exchanges: queueService.createExchanges([
          EMAIL_VERIFIED_EXCHANGE,
          MFA_ENROLLED_EXCHANGE,
        ]),
        uri: configService.get(ConfigVariables.QUEUE_URL),
        connectionInitOptions: { wait: false },
      }),
    }),
  ],
  providers: [UserService],
  controllers: [UserController, InternalUserController],
})
export class UserModule {}
