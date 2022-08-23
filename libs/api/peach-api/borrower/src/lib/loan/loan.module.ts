import { Module } from '@nestjs/common';
import { PeachBorrowerService } from './loan.service';
import {
  PeachBorrowerController,
  PeachBorrowerQueueController,
} from './loan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrower } from '../borrower.entity';
import { PeachApiModule } from '../api/peach_api.module';
import { CryptoModule } from '@archie/api/utils/crypto';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/peach-api/constants';

@Module({
  controllers: [PeachBorrowerQueueController, PeachBorrowerController],
  imports: [
    TypeOrmModule.forFeature([Borrower]),
    PeachApiModule,
    CryptoModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        encryptionKey: configService.get(ConfigVariables.ENCRYPTION_KEY),
      }),
    }),
  ],
  providers: [PeachBorrowerService],
  exports: [PeachBorrowerService],
})
export class LoanModule {}
