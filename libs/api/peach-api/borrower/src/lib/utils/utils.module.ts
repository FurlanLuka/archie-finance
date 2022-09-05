import { Module } from '@nestjs/common';
import { BorrowerValidation } from './borrower.validation';

@Module({
  controllers: [],
  imports: [],
  providers: [BorrowerValidation],
  exports: [BorrowerValidation],
})
export class BorrowerUtil {}
