import { Module } from '@nestjs/common';
import { InternalApiModule } from '@archie-microservices/internal-api';
import { Auth0Module } from '../auth0/auth0.module';
import { InternalUserController, UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@archie-microservices/config';
import { ConfigVariables } from '@archie/api/user-api/constants';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  SERVICE_QUEUE_NAME as ONBOARDING_SERVICE_QUEUE_NAME,
  SERVICE_NAME as ONBOARDING_SERVICE_NAME,
} from '@archie/api/onboarding-api/constants';

@Module({
  imports: [
    Auth0Module,
    InternalApiModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        internalApiUrl: configService.get(ConfigVariables.INTERNAL_API_URL),
      }),
    }),
    ClientsModule.register([
      {
        name: ONBOARDING_SERVICE_NAME,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.QUEUE_URL],
          queue: ONBOARDING_SERVICE_QUEUE_NAME,
        },
      },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController, InternalUserController],
})
export class UserModule {}
