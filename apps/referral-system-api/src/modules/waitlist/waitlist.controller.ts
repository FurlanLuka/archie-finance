import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateDto, IdParamsDto } from './waitlist.dto';
import { GetWaitlistRecordResponse } from './waitlist.interfaces';
import { WaitlistService } from './waitlist.service';

@Controller('v1/waitlist')
export class WaitlistController {
  constructor(private waitlistService: WaitlistService) {}

  @Post()
  public async create(@Body() body: CreateDto): Promise<void> {
    return this.waitlistService.create(body.emailAddress, body.referrer);
  }

  @Post('verify/:id')
  public async verify(@Param() params: IdParamsDto): Promise<void> {
    return this.waitlistService.verifyEmail(params.id);
  }

  @Get(':id')
  public async get(
    @Param() params: IdParamsDto,
  ): Promise<GetWaitlistRecordResponse> {
    return this.waitlistService.get(params.id);
  }
}
