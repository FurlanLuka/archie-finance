import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PeachApiService } from '../api/peach_api.service';
import { Borrower } from '../borrower.entity';
import { BorrowerValidation } from '../utils/borrower.validation';
import { GetLoanBalancesDto } from './loan-balances.dto';
import { GetLoanBalancesResponse } from '@archie/api/peach-api/data-transfer-objects';

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

    const balance = await this.peachApiService.getLoanBalances(
      borrower.personId,
      borrower.creditLineId,
    );

    return {
      isBalanceChangeInProgress: balance.isLocked,
      availableCredit: balance.availableCreditAmount,
      totalCredit: balance.creditLimitAmount,
      utilizationAmount: balance.utilizationAmount,
    };
  }

  public async getLatestLoanBalance(
    userId: string,
  ): Promise<GetLoanBalancesResponse> {
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
      calculatedAt: balance.calculatedAt,
    };
  }
}
