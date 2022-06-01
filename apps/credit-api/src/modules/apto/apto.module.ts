import { Module } from '@nestjs/common';
import { AptoApiService } from './apto.api.service';
import { AptoController } from './apto.controller';
import { AptoService } from './apto.service';

@Module({
  controllers: [AptoController],
  providers: [AptoService, AptoApiService],
})
export class AptoModule {}
