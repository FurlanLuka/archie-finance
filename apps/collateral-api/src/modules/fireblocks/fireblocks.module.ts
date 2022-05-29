import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FireblocksService } from './fireblocks.service';

@Module({
  imports: [PassportModule],
  providers: [FireblocksService],
  exports: [FireblocksService],
})
export class FireblocksModule {}
