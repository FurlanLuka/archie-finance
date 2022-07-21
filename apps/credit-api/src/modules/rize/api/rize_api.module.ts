import { Module } from '@nestjs/common';
import { RizeApiService } from './rize_api.service';

@Module({
  imports: [],
  providers: [RizeApiService],
  exports: [RizeApiService],
})
export class RizeApiModule {}
