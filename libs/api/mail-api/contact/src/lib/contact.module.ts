import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './contact.entity';
import { CryptoModule } from '@archie/api/utils/crypto';
import { ConfigModule, ConfigService } from '@archie/api/utils/config';
import { ConfigVariables } from '@archie/api/mail-api/constants';
import { ContactController } from './contact.controller';

@Module({
  controllers: [ContactController],
  imports: [
    TypeOrmModule.forFeature([Contact]),
    CryptoModule.register({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        encryptionKey: configService.get(ConfigVariables.ENCRYPTION_KEY),
      }),
    }),
  ],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
