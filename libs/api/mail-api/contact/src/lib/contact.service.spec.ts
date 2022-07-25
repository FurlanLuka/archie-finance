import { Test } from '@nestjs/testing';
import { ContactService } from './contact.service';

describe('ApiMailApiContactService', () => {
  let service: ContactService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ContactService],
    }).compile();

    service = module.get(ContactService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
