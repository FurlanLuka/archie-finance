import { Module } from '@nestjs/common';
import { Auth0Module } from '../auth0/auth0.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [Auth0Module],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
