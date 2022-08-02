import { Module } from '@nestjs/common';
import { PeachService } from './peach.service';

@Module({
  controllers: [],
  providers: [PeachService],
  exports: [PeachService],
})
export class PeachModule {}
