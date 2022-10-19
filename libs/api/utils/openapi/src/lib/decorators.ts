import {
  ApiProperty,
  ApiResponse,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import { HttpException } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { ExamplesObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

type ErrorsByStatus = Record<string, HttpException[]>;

export class ErrorResponse {
  @ApiProperty({ type: Number })
  statusCode: number;

  @ApiProperty({ type: String })
  message: string;
}

export function ApiErrorResponse<T extends ClassConstructor<HttpException>>(
  errors: T[],
) {
  return (
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ): void => {
    ApiExtraModels(ErrorResponse);

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
      const errorExamples: ExamplesObject = errorsByStatus[status].reduce(
        (examples: ExamplesObject, error: HttpException) => {
          examples[error.message] = {
            value: {
              statusCode: error.getStatus(),
              message: error.message,
            },
          };

          return examples;
        },
        {},
      );

      ApiResponse({
        status: Number(status),
        description: `Error response with ${status} status code.`,
        content: {
          'application/json': {
            schema: {
              $ref: getSchemaPath(ErrorResponse),
            },
            examples: errorExamples,
          },
        },
      })(target, propertyKey, descriptor);
    });
  };
}
