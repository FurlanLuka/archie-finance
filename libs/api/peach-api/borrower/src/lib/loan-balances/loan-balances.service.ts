import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PeachApiService } from '../api/peach_api.service';
import { Borrower } from '../borrower.entity';
import { BorrowerValidation } from '../utils/borrower.validation';
import { GetLoanBalancesDto } from './loan-balances.dto';

@Injectable()
export class LoanBalancesService {
  constructor(
    private peachApiService: PeachApiService,
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
    private borrowerValidation: BorrowerValidation,
  ) {}

  public async getLoanBalances(userId: string): Promise<GetLoanBalancesDto> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    this.borrowerValidation.isBorrowerCreditLineDefined(borrower);

    const balance = await this.peachApiService.getCreditBalance(
      borrower.personId,
      borrower.creditLineId,
    );

    return {
      availableCredit: balance.availableCreditAmount,
      totalCredit: balance.creditLimitAmount,
      utilizationAmount: balance.utilizationAmount,
    };
  }
}
