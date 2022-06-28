import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoModule } from '@archie-microservices/crypto';
import { WaitlistService } from './waitlist.service';
import { WaitlistController } from './waitlist.controller';
import { Waitlist } from './waitlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Waitlist]), CryptoModule],
  providers: [WaitlistService],
  controllers: [WaitlistController],
})
export class WaitlistModule {}
