import { Test } from '@nestjs/testing';
import { PeachService } from './peach.service';

describe('ApiCreditApiPeachService', () => {
  let service: PeachService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PeachService],
    }).compile();

    service = module.get(PeachService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
