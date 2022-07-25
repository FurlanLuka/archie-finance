import { Test } from '@nestjs/testing';
import { EmailDataFactoryService } from './email-data-factory.service';

describe('ApiMailApiUtilsEmailDataFactoryService', () => {
  let service: EmailDataFactoryService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EmailDataFactoryService],
    }).compile();

    service = module.get(EmailDataFactoryService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
