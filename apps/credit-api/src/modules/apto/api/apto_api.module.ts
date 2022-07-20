import { Module } from '@nestjs/common';
import { AptoApiService } from './apto_api.service';
import { CryptoModule } from '@archie/api/utils/crypto';

@Module({
  imports: [CryptoModule],
  providers: [AptoApiService],
  exports: [AptoApiService],
})
export class AptoApiModule {}
