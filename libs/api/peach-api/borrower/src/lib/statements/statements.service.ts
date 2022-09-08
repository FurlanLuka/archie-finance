import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Statement } from '../api/peach_api.interfaces';
import { PeachApiService } from '../api/peach_api.service';
import { Borrower } from '../borrower.entity';
import { BorrowerValidation } from '../utils/borrower.validation';
import { GetLoanDocumentDto } from './statements.dto';

@Injectable()
export class LoanStatementsService {
  constructor(
    private peachApiService: PeachApiService,
    @InjectRepository(Borrower)
    private borrowerRepository: Repository<Borrower>,
    private borrowerValidation: BorrowerValidation,
  ) {}

  public async getLoanStatements(userId: string): Promise<Statement[]> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    this.borrowerValidation.isBorrowerCreditLineDefined(borrower);

    const statements = await this.peachApiService.getStatements(
      borrower.personId,
      borrower.creditLineId,
    );

    return statements;
  }

  public async getLoanDocumentUrl(
    userId: string,
    documentId: string,
  ): Promise<GetLoanDocumentDto> {
    const borrower: Borrower | null = await this.borrowerRepository.findOneBy({
      userId,
    });
    this.borrowerValidation.isBorrowerCreditLineDefined(borrower);

    const { url } = await this.peachApiService.getDocumentUrl(
      borrower.personId,
      documentId,
    );

    return { url };
  }
}
