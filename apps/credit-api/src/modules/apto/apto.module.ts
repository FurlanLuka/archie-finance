import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AptoApiModule } from './api/apto_api.module';
import { AptoController } from './apto.controller';
import { AptoService } from './apto.service';
import { AptoVerification } from './apto_verification.entity';

@Module({
  controllers: [AptoController],
  providers: [AptoService],
  imports: [TypeOrmModule.forFeature([AptoVerification]), AptoApiModule],
})
export class AptoModule {}
