import { Test } from '@nestjs/testing';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CryptoService],
    }).compile();

    service = module.get(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
