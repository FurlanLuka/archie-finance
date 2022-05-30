import { VaultModule } from '@archie-microservices/vault';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternalApiModule } from '../../../../../libs/internal-api/src';
import { ConfigVariables } from '../../interfaces';
import { KycController } from './kyc.controller';
import { Kyc } from './kyc.entity';
import { KycService } from './kyc.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Kyc]),
    VaultModule,
    InternalApiModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        internalApiUrl: configService.get(ConfigVariables.INTERNAL_API_URL),
      }),
    }),
  ],
  controllers: [KycController],
  providers: [KycService],
})
export class KycModule {}
