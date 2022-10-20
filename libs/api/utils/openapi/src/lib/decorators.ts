import { ApiProperty, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { HttpException } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { ExamplesObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

type ErrorsByStatus = Record<string, HttpException[] | undefined>;

export class ErrorResponse {
  @ApiProperty({ type: Number })
  statusCode: number;

  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ type: String })
  error: string;
}

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

        const alreadyGroupedErrors = errorsGroupedByStatusCode[errorStatus];

        errorsGroupedByStatusCode[errorStatus] =
          alreadyGroupedErrors === undefined
            ? [initializedError]
            : [...alreadyGroupedErrors, initializedError];

        return errorsGroupedByStatusCode;
      },
      {},
    );

    Object.keys(errorsByStatus).forEach((status) => {
      const errorExamples: ExamplesObject = (<HttpException[]>(
        errorsByStatus[status]
      )).reduce((examples: ExamplesObject, error: HttpException) => {
        examples[error.message] = {
          value: error.getResponse(),
        };

        return examples;
      }, {});

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
