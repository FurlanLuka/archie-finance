import { ApiErrorResponse } from '@archie-microservices/openapi';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { WalletCreateDto, WalletDto } from './wallet.dto';
import { WalletService } from './wallet.service';

@Controller('v1/wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiErrorResponse([BadRequestException])
  async createWallet(
    @Request() req,
    @Body() body: WalletCreateDto,
  ): Promise<WalletDto> {
    return this.walletService.createWallet({
      userId: req.user.sub,
      name: body.name,
    });
  }
}
