import { VaultModule } from '@archie-microservices/vault';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendgridModule } from '@archie-microservices/sendgrid';
import { UserModule } from '../user/user.module';
import { InternalKycController, KycController } from './kyc.controller';
import { Kyc } from './kyc.entity';
import { KycService } from './kyc.service';
import { ConfigModule, ConfigService } from '@archie-microservices/config';
import { ConfigVariables } from '../../interfaces';

@Module({
  imports: [
    TypeOrmModule.forFeature([Kyc]),
    VaultModule,
    UserModule,
    SendgridModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get(ConfigVariables.SENDGRID_API_KEY),
      }),
    }),
  ],
  controllers: [KycController, InternalKycController],
  providers: [KycService],
})
export class KycModule {}
