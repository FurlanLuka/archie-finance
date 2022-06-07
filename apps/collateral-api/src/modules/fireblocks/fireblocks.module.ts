import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FireblocksService } from './fireblocks.service';
import { CryptoModule } from '@archie-microservices/crypto';

@Module({
  imports: [PassportModule, CryptoModule],
  providers: [FireblocksService],
  exports: [FireblocksService],
})
export class FireblocksModule {}
