import { Module } from '@nestjs/common';
import { EmailWaitlistController } from './email_waitlist.controller';

@Module({
  imports: [],
  controllers: [EmailWaitlistController],
  providers: [],
})
export class EmailWaitlistModule {}
