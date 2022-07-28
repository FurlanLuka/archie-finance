import { Module } from '@nestjs/common';
import { Auth0Module } from '@archie/api/user-api/auth0';
import { InternalUserController, UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [Auth0Module],
  providers: [UserService],
  controllers: [UserController, InternalUserController],
})
export class UserModule {}
