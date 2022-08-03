import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaidController } from './plaid.controller';
import { PlaidService } from './plaid.service';

@Module({
  imports: [],
  exports: [PlaidService],
  providers: [PlaidService],
  controllers: [PlaidController],
})
export class PlaidModule {}
