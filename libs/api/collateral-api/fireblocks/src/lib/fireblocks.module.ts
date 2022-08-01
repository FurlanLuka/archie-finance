import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FireblocksService } from './fireblocks.service';
import { CryptoModule } from '@archie/api/utils/crypto';

@Module({
  imports: [PassportModule, CryptoModule.register()],
  providers: [FireblocksService],
  exports: [FireblocksService],
  controllers: [],
})
export class FireblocksModule {}
