import { Module } from '@nestjs/common';
import { RizeFactoryService } from './rize_factory.service';

@Module({
  imports: [],
  providers: [RizeFactoryService],
  exports: [RizeFactoryService],
})
export class RizeFactoryModule {}
