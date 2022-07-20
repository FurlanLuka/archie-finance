import { Module } from '@nestjs/common';
import { Auth0Module } from '../auth0/auth0.module';
import { InternalUserController, UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@archie-microservices/config';
import {
  ConfigVariables,
  EMAIL_VERIFIED_EXCHANGE,
  MFA_ENROLLED_EXCHANGE,
} from '@archie/api/user-api/constants';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
@Module({
  imports: [
    Auth0Module,
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [EMAIL_VERIFIED_EXCHANGE, MFA_ENROLLED_EXCHANGE],
        uri: configService.get(ConfigVariables.QUEUE_URL),
        connectionInitOptions: { wait: false },
      }),
    }),
  ],
  providers: [UserService],
  controllers: [UserController, InternalUserController],
})
export class UserModule {}
