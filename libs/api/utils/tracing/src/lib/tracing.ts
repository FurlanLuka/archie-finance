import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import tracer, { Span } from 'dd-trace';
import { RequestWithUser } from '@archie/api/utils/auth0';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest<Request>();
    const span: Span | null = tracer.scope().active();

    const requestSubject: string | undefined = (<RequestWithUser>request).user
      ?.sub;

    Logger.error({
      error: exception,
      user_id: requestSubject,
    });

    if (span !== null) {
      span.setTag('error', exception);
      span.setTag('user_id', requestSubject);
    }

    super.catch(exception, host);
  }
}
