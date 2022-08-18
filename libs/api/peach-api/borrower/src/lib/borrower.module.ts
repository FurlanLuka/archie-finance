import { Module } from '@nestjs/common';
import { PeachBorrowerService } from './borrower.service';
import { PeachBorrowerQueueController } from './borrower.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrower } from './borrower.entity';
import { PeachApiModule } from './api/peach_api.module';
import { CryptoModule } from '@archie/api/utils/crypto';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/credit-api/constants';

@Module({
  controllers: [PeachBorrowerQueueController],
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
export class PeachBorrowerModule {}
