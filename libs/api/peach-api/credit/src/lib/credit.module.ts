import { Module } from '@nestjs/common';
import { PeachCreditService } from './credit.service';
import { PeachQueueController } from './credit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrower } from './borrower.entity';
import { PeachApiModule } from './api/peach_api.module';
import { CryptoModule } from '@archie/api/utils/crypto';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/credit-api/constants';

@Module({
  controllers: [PeachQueueController],
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
  providers: [PeachCreditService],
  exports: [PeachCreditService],
})
export class PeachCreditModule {}
