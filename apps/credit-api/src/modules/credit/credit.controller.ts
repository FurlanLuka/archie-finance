import { Controller, Post } from "@nestjs/common";

@Controller('v1/credit')
export class CreditController {

  @Post()
  async createCreditLine() {}

}