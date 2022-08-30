import { Module } from '@nestjs/common';
import { LtvController } from './ltv.controller';
import { LtvService } from './ltv.service';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [UtilsModule],
  controllers: [LtvController],
  providers: [LtvService],
  exports: [LtvService],
})
export class LtvModule {}
