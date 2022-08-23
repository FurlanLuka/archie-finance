import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import {
  SalesConnectDto,
} from './sales_connect.dto';
import { SalesConnectService } from './sales_connect.service';

@Controller('v1/sales-connect')
export class SalesConnectController {
  constructor(private salesConnectService: SalesConnectService) {}

  @Post()
  public async connect(@Body() body: SalesConnectDto): Promise<void> {
    return this.salesConnectService.connect(body);
  }

}
