import { Module } from '@nestjs/common';
import { SalesConnectService } from './sales_connect.service';
import { SalesConnectController } from './sales_connect.controller';

@Module({
  providers: [SalesConnectService],
  controllers: [SalesConnectController],
})
export class SalesConnectModule {}
