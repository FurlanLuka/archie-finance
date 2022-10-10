import { Module } from '@nestjs/common';
import { CreditService } from './credit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credit } from './credit.entity';
import { UtilsModule } from '../ltv/utils/utils.module';

@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature([Credit]), UtilsModule],
  providers: [CreditService],
  exports: [CreditService],
})
export class CreditModule {}
