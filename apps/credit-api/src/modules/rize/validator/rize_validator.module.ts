import { Module } from '@nestjs/common';
import { RizeValidatorService } from './rize_validator.service';

@Module({
  imports: [],
  providers: [RizeValidatorService],
  exports: [RizeValidatorService],
})
export class RizeValidatorModule {}
