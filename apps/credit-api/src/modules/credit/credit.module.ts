import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CreditController,
  InternalCreditController,
} from './credit.controller';
import { Credit } from './credit.entity';
import { CreditService } from './credit.service';
import { InternalApiModule } from '@archie-microservices/internal-api';
import { ConfigModule, ConfigService } from '@archie-microservices/config';
import { ConfigVariables } from '../../interfaces';
@Module({
  controllers: [CreditController, InternalCreditController],
  imports: [
    TypeOrmModule.forFeature([Credit]),
    InternalApiModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        internalApiUrl: configService.get(ConfigVariables.INTERNAL_API_URL),
      }),
    }),
  ],
  providers: [CreditService],
})
export class CreditModule {}
