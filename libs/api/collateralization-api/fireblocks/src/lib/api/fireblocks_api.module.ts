import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FireblocksApiService } from './fireblocks_api.service';
import { CryptoModule } from '@archie/api/utils/crypto';

@Module({
  imports: [PassportModule, CryptoModule.register()],
  providers: [FireblocksApiService],
  exports: [FireblocksApiService],
  controllers: [],
})
export class FireblocksApiModule {}
