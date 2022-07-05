import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CreditController,
  InternalCreditController,
} from './credit.controller';
import { Credit } from './credit.entity';
import { CreditService } from './credit.service';
import {
  SERVICE_QUEUE_NAME as ONBOARDING_SERVICE_QUEUE_NAME,
  SERVICE_NAME as ONBOARDING_SERVICE_NAME,
} from '@archie/api/onboarding-api/constants';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [CreditController, InternalCreditController],
  imports: [
    TypeOrmModule.forFeature([Credit]),
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
  providers: [CreditService],
  exports: [CreditService],
})
export class CreditModule {}
