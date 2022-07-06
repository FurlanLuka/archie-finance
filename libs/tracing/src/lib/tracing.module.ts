
import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import tracer, { Span } from 'dd-trace';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const span: Span = tracer.scope().active()

    if (span !== null) {
      console.log(exception)
      span.setTag('error', exception)
    }

    super.catch(exception, host);
  }
}