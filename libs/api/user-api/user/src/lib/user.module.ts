import { Module } from '@nestjs/common';
import { Auth0Module } from '@archie/api/user-api/auth0';
import { UserQueueController, UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [Auth0Module],
  providers: [UserService],
  controllers: [UserController, UserQueueController],
})
export class UserModule {}
