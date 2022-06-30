import { ApiResponse } from '@nestjs/swagger';
import { HttpException } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';

export function ApiErrorResponse<T extends ClassConstructor<HttpException>>(
  errors: T[],
) {
  return (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    errors.forEach((Error: T) => {
      const initializedError: HttpException = new Error();

      ApiResponse({
        status: initializedError.getStatus(),
        description: initializedError.message,
      })(target, propertyKey, descriptor);
    });
  };
}