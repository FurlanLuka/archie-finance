import { Module } from '@nestjs/common';
import { InternalApiModule } from '@archie-microservices/internal-api';
import { Auth0Module } from '../auth0/auth0.module';
import { InternalUserController, UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@archie-microservices/config';
import { ConfigVariables } from '@archie/api/user/constants';

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
  ],
  providers: [UserService],
  controllers: [UserController, InternalUserController],
})
export class UserModule {}
