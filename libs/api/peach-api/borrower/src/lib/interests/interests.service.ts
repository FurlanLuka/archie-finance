import { Injectable } from '@nestjs/common';
import { PeachApiService } from '../api/peach_api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Borrower } from '../borrower.entity';
import { Repository } from 'typeorm';
import { BorrowerValidation } from '../utils/borrower.validation';
import { LoanInterests } from '@archie/api/peach-api/data-transfer-objects/types';
import { CreditLine } from '@archie/api/peach-api/data-transfer-objects/types';

@Injectable()
export class InterestsService {
  constructor(
    private peachApiService: PeachApiService,
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
    private borrowerValidation: BorrowerValidation,
  ) {}

  public async getInterests(userId: string): Promise<LoanInterests> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    this.borrowerValidation.isBorrowerCreditLineDefined(borrower);

    const creditLine: CreditLine = await this.peachApiService.getCreditLine(
      borrower.personId,
      borrower.creditLineId,
    );

    return {
      aprEffective: creditLine.atOrigination.aprEffective ?? 0,
      aprNominal: creditLine.atOrigination.aprNominal ?? 0,
    };
  }
}
