import { Injectable } from '@nestjs/common';
import { QueryFailedError, TypeORMError } from 'typeorm';

@Injectable()
export class DatabaseErrorHandlingService {
  DUPLICATED_RECORD_ERR_CODE = '23505';

  public ignoreDuplicatedRecordError(error: TypeORMError): void {
    if (
      !(
        error instanceof QueryFailedError &&
        error.driverError.code === this.DUPLICATED_RECORD_ERR_CODE
      )
    ) {
      throw error;
    }
  }
}
