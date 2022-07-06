import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import tracer, { Span } from 'dd-trace';

interface RequestWithUser extends Request {
  user?: {
    sub: string;
  };
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest<Request>();
    const span: Span | null = tracer.scope().active();

    if (span !== null) {
      span.setTag('error', exception);
      span.setTag('userId', (<RequestWithUser>request).user?.sub);
    } else {
      Logger.error({
        error: exception,
        userId: (<RequestWithUser>request).user?.sub,
      });
    }

    super.catch(exception, host);
  }
}
