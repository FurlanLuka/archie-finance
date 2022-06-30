import { Module } from '@nestjs/common';
import { RizeController } from './rize.controller';
import { RizeService } from './rize.service';
import { RizeApiModule } from './api/rize_api.module';

@Module({
  controllers: [RizeController],
  providers: [RizeService],
  imports: [RizeApiModule],
})
export class RizeModule {}
