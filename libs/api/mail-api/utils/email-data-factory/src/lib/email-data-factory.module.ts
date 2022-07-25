import { Module } from '@nestjs/common';
import { EmailDataFactoryService } from './email-data-factory.service';

@Module({
  controllers: [],
  providers: [EmailDataFactoryService],
  exports: [EmailDataFactoryService],
})
export class EmailDataFactoryModule {}
