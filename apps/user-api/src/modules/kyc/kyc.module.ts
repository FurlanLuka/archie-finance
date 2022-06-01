import { VaultModule } from '@archie-microservices/vault';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigVariables } from '../../interfaces';
import { InternalKycController, KycController } from './kyc.controller';
import { Kyc } from './kyc.entity';
import { KycService } from './kyc.service';
import { InternalApiModule } from '@archie-microservices/internal-api';

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
  controllers: [KycController, InternalKycController],
  providers: [KycService],
})
export class KycModule {}
