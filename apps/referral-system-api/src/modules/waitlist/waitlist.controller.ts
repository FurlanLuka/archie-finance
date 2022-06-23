import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreatetDto } from './waitlist.dto';
import { GetWaitlistRecordResponse } from './waitlist.interfaces';
import { WaitlistService } from './waitlist.service';

@Controller('v1/waitlist')
export class WaitlistController {
  constructor(private waitlistService: WaitlistService) {}

  @Post()
  public async create(@Body() body: CreatetDto): Promise<void> {
    return this.waitlistService.create(body.emailAddress, body.referrer);
  }

  @Post('verify/:id')
  public async verify(@Param('id') id: string): Promise<void> {
    return this.waitlistService.verifyEmail(id);
  }

  @Get(':id')
  public async get(
    @Param('id') id: string,
  ): Promise<GetWaitlistRecordResponse> {
    return this.waitlistService.get(id);
  }
}
