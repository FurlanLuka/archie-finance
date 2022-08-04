import { Module } from '@nestjs/common';
import { PeachService } from './peach.service';
import { PeachQueueController } from './peach.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Borrower } from './borrower.entity';
import { CryptoModule } from '@archie/api/utils/crypto';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/mail-api/constants';
import { PeachApiModule } from './api/peach_api.module';

@Module({
  controllers: [PeachQueueController],
  imports: [
    TypeOrmModule.forFeature([Borrower]),
    CryptoModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        encryptionKey: configService.get(ConfigVariables.ENCRYPTION_KEY),
      }),
    }),
    PeachApiModule,
  ],
  providers: [PeachService],
  exports: [PeachService],
})
export class PeachModule {}
