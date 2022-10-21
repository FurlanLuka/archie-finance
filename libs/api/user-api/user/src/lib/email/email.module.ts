import { Module } from '@nestjs/common';
import { Auth0Module } from '@archie/api/user-api/auth0';
import { EmailQueueController, EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [Auth0Module],
  providers: [EmailService],
  controllers: [EmailController, EmailQueueController],
})
export class EmailModule {}
