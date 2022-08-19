import { Module } from '@nestjs/common';
import { PeachBorrowerService } from './borrower/borrower.service';
import {
  PeachBorrowerController,
  PeachBorrowerQueueController,
} from './borrower/borrower.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrower } from './borrower.entity';
import { PeachApiModule } from './api/peach_api.module';
import { CryptoModule } from '@archie/api/utils/crypto';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/credit-api/constants';
import { PeachPaymentInstrumentsService } from './payment-instruments/payment_instruments.service';
import { PeachPaymentInstrumentsController } from './payment-instruments/payment_instruments.controller';

@Module({
  controllers: [
    PeachBorrowerQueueController,
    PeachBorrowerController,
    PeachPaymentInstrumentsController,
  ],
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
  providers: [PeachBorrowerService, PeachPaymentInstrumentsService],
  exports: [PeachBorrowerService],
})
export class PeachBorrowerModule {}
