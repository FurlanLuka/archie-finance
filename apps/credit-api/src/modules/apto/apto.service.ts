import { Injectable } from '@nestjs/common';
import { AptoApiService } from './apto.api.service';

@Injectable()
export class AptoService {
  constructor(private aptoApiService: AptoApiService) {}
}
