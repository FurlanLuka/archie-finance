import { Module } from "@nestjs/common";
import { AptoApiService } from "./apto_api.service";

@Module({
  providers: [AptoApiService],
  exports: [AptoApiService],
})
export class AptoApiModule {}