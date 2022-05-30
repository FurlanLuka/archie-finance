import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditController } from './credit.controller';
import { Credit } from './credit.entity';
import { CreditService } from './credit.service';
@Module({
  controllers: [CreditController],
  imports: [TypeOrmModule.forFeature([Credit])],
  providers: [CreditService],
})
export class CreditModule {}
