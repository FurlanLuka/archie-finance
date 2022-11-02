import { Injectable } from '@nestjs/common';
import { Borrower } from '../borrower.entity';
import { Balances, Obligation, Obligations } from '@archie/api/peach-api/data-transfer-objects/types';
import { ObligationsResponseDto } from './obligations.dto';
import { PeachApiService } from '../api/peach_api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BorrowerValidation } from '../utils/borrower.validation';
import { ObligationsResponseFactory } from './utils/obligations_response.factory';

@Injectable()
export class ObligationsService {
  constructor(
    private peachApiService: PeachApiService,
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
    private borrowerValidation: BorrowerValidation,
    private obligationsResponseFactory: ObligationsResponseFactory,
  ) {}

  public async getObligations(userId: string): Promise<ObligationsResponseDto> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    this.borrowerValidation.isBorrowerCreditLineDefined(borrower);

    const [obligations, balances]: [Obligations, Balances] = await Promise.all([
      this.peachApiService.getLoanObligations(borrower.personId, borrower.creditLineId),
      this.peachApiService.getLoanBalances(borrower.personId, borrower.creditLineId),
    ]);

    const dueObligations: Obligation[] = obligations.obligations.filter(
      (obligation: Obligation) => !obligation.isOpen && !obligation.isFulfilled,
    );
    const futureObligations: Obligation[] = obligations.obligations.filter(
      (obligation: Obligation) => obligation.isOpen,
    );

    return this.obligationsResponseFactory.create(balances, dueObligations, futureObligations);
  }
}
