import { ApiResponse } from '@nestjs/swagger';
import { HttpException } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';

type ErrorsByStatus = Record<string, HttpException[]>;

export function ApiErrorResponse<T extends ClassConstructor<HttpException>>(
  errors: T[],
) {
  return (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): void => {
    const errorsByStatus = errors.reduce(
      (errorsGroupedByStatusCode: ErrorsByStatus, Error: T) => {
        const initializedError: HttpException = new Error();
        const errorStatus: string = initializedError.getStatus().toString();

        errorsGroupedByStatusCode[errorStatus] =
          errorsGroupedByStatusCode[errorStatus] === undefined
            ? [initializedError]
            : [...errorsGroupedByStatusCode[errorStatus], initializedError];

        return errorsGroupedByStatusCode;
      },
      {},
    );

    Object.keys(errorsByStatus).forEach((status) => {
      ApiResponse({
        status: Number(status),
        description: errorsByStatus[status]
          .map((error) => error.message)
          .join(' | '),
      })(target, propertyKey, descriptor);
    });
  };
}
