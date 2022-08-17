import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaidApiModule } from './api/plaid-api.module';
import { PlaidController } from './plaid.controller';
import { PlaidAccess } from './plaid_access.entity';
import { PlaidService } from './plaid.service';

@Module({
  imports: [PlaidApiModule, TypeOrmModule.forFeature([PlaidAccess])],
  exports: [PlaidService],
  providers: [PlaidService],
  controllers: [PlaidController],
})
export class PlaidModule {}
