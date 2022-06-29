import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  CreateDto,
  GetWaitlistRecordResponseDto,
  IdParamsDto,
} from './waitlist.dto';
import { WaitlistService } from './waitlist.service';
import { ApiErrorResponse } from '@archie-microservices/openapi';

@Controller('v1/waitlist')
export class WaitlistController {
  constructor(private waitlistService: WaitlistService) {}

  @Post()
  public async create(@Body() body: CreateDto): Promise<void> {
    return this.waitlistService.create(body.emailAddress, body.referrer);
  }

  @Post('verify/:id')
  @ApiErrorResponse([NotFoundException])
  public async verify(@Param() params: IdParamsDto): Promise<void> {
    return this.waitlistService.verifyEmail(params.id);
  }

  @Get(':id')
  @ApiErrorResponse([NotFoundException])
  public async get(
    @Param() params: IdParamsDto,
  ): Promise<GetWaitlistRecordResponseDto> {
    return this.waitlistService.get(params.id);
  }
}
