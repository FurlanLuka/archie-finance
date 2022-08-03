import { Module } from '@nestjs/common';
import { PeachService } from './peach.service';
import { PeachQueueController } from './peach.controller';

@Module({
  controllers: [PeachQueueController],
  providers: [PeachService],
  exports: [PeachService],
})
export class PeachModule {}
