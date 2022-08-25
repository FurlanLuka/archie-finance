import { Injectable } from '@nestjs/common';
import { Borrower } from '../borrower.entity';
import { Balances, Obligation, Obligations } from '../api/peach_api.interfaces';
import { ObligationsResponseDto } from './obligations.dto';
import { PeachApiService } from '../api/peach_api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BorrowerValidation } from '../utils/borrower.validation';

@Injectable()
export class ObligationsService {
  constructor(
    private peachApiService: PeachApiService,
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
    private borrowerValidation: BorrowerValidation,
  ) {}

  public async getObligations(userId: string): Promise<ObligationsResponseDto> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    this.borrowerValidation.isBorrowerCreditLineDefined(borrower);

    const [obligations, balances]: [Obligations, Balances] = await Promise.all([
      this.peachApiService.getLoanObligations(
        borrower.personId,
        borrower.creditLineId,
      ),
      this.peachApiService.getLoanBalances(
        borrower.personId,
        borrower.creditLineId,
      ),
    ]);

    const dueObligations: Obligation[] = obligations.obligations.filter(
      (obligation: Obligation) => !obligation.isOpen && !obligation.isFulfilled,
    );

    return {
      outstandingBalances: balances.outstandingBalances,
      overdueBalances: balances.overdueBalances,
      dueBalances: balances.dueBalances,
      statementObligations: dueObligations.map((obligation: Obligation) => ({
        capitalizedAmount: obligation.capitalizedAmount,
        dueDate: obligation.dueDate,
        fulfilledAmount: obligation.fulfilledAmount,
        gracePeriod: obligation.gracePeriod,
        isOverdue: obligation.isOverdue,
        obligationAmount: obligation.obligationAmount,
        overpaymentsAmount: obligation.overpaymentsAmount,
        remainingAmount: obligation.remainingAmount,
      })),
    };
  }
}
