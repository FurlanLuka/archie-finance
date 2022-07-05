import { VaultModule } from '@archie-microservices/vault';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternalKycController, KycController } from './kyc.controller';
import { Kyc } from './kyc.entity';
import { KycService } from './kyc.service';
import {
  SERVICE_QUEUE_NAME as ONBOARDING_SERVICE_QUEUE_NAME,
  SERVICE_NAME as ONBOARDING_SERVICE_NAME,
} from '@archie/api/onboarding-api/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Kyc]),
    VaultModule,
    ClientsModule.register([
      {
        name: ONBOARDING_SERVICE_NAME,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.QUEUE_URL],
          queue: ONBOARDING_SERVICE_QUEUE_NAME,
        },
      },
    ]),
  ],
  controllers: [KycController, InternalKycController],
  providers: [KycService],
})
export class KycModule {}
