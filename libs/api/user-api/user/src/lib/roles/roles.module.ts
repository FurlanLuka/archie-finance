import { Module } from '@nestjs/common';
import { Auth0Module } from '@archie/api/user-api/auth0';
import { RolesQueueController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [Auth0Module],
  providers: [RolesService],
  controllers: [RolesQueueController],
})
export class RolesModule {}
