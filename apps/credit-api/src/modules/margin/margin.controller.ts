import { Controller, Post } from '@nestjs/common';
import { MarginService } from './margin.service';

@Controller('internal/margins')
export class MarginController {
  constructor(private marginService: MarginService) {}

  @Post()
  async checkMargin(): Promise<void> {
    return this.marginService.checkMargin();
  }
}
