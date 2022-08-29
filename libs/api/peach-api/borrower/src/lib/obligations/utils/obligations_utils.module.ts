import { Module } from '@nestjs/common';
import { ObligationsResponseFactory } from './obligations_response.factory';

@Module({
  controllers: [],
  imports: [],
  providers: [ObligationsResponseFactory],
  exports: [ObligationsResponseFactory],
})
export class ObligationsUtilModule {}
