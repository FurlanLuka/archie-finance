import { Injectable } from '@nestjs/common';
import { LtvResponseDto } from './ltv.dto';

@Injectable()
export class LtvService {
  async getCurrentLtv(_userId: string): Promise<LtvResponseDto> {
    // get collateral - handle events and store locally
    // get current credit balance - handle events and store locally
    // get asset prices - api call

    return <LtvResponseDto>{};
  }
}
