import { Module } from '@nestjs/common';
import { MarginService } from './margin.service';
import { UtilsModule } from './utils/utils.module';
import { MarginController } from './margin.controller';
import { MarginEntitiesModule } from './entities/margin_entities.module';

@Module({
  controllers: [MarginController],
  imports: [UtilsModule, MarginEntitiesModule],
  providers: [MarginService],
  exports: [MarginService],
})
export class MarginModule {}
