import { ConfigModule, ConfigService } from '@archie-microservices/config';
import { InternalApiModule } from '@archie-microservices/internal-api';
import { ConfigVariables } from '@archie/api/user-api/constants';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FireblocksModule } from '../fireblocks/fireblocks.module';
import { WalletController } from './wallet.controller';
import { Wallet } from './wallet.entity';
import { WalletService } from './wallet.service';

@Module({
  imports: [
    FireblocksModule,
    TypeOrmModule.forFeature([Wallet]),
    InternalApiModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        internalApiUrl: configService.get(ConfigVariables.INTERNAL_API_URL),
      }),
    }),
  ],
  exports: [WalletService],
  providers: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
