import { Module } from '@nestjs/common';
import { PeachApiService } from './peach_api.service';

@Module({
  controllers: [],
  providers: [PeachApiService],
  exports: [PeachApiService],
})
export class PeachApiModule {}
