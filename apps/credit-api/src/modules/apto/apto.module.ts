import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditModule } from '../credit/credit.module';
import { AptoApiModule } from './api/apto_api.module';
import { AptoController } from './apto.controller';
import { AptoService } from './apto.service';
import { AptoCard } from './apto_card.entity';
import { AptoCardApplication } from './apto_card_application.entity';
import { AptoUser } from './apto_user.entity';
import { AptoVerification } from './apto_verification.entity';

@Module({
  controllers: [AptoController],
  providers: [AptoService],
  imports: [
    TypeOrmModule.forFeature([
      AptoVerification,
      AptoUser,
      AptoCardApplication,
      AptoCard,
    ]),
    AptoApiModule,
    CreditModule,
  ],
})
export class AptoModule {}
