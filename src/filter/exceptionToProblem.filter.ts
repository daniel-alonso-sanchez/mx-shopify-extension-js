import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { NotAuthorizedException } from '../exception/notAuthorizedException';
import { NotValidException } from '../exception/notValidException';
import { NotFoundException } from '../exception/notFoundException';
import { ExtensionException } from '../exception/extensionException';
import { context, trace } from '@opentelemetry/api';

@Catch()
export class ExceptionToProblemFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let title = 'Generic Error';
    let detail = 'Internal Server Error';

    if (exception instanceof ExtensionException) {
      title = (exception as ExtensionException).title;
      detail = (exception as ExtensionException).detail;
    }
    if (exception instanceof NotAuthorizedException) {
      status = HttpStatus.UNAUTHORIZED.valueOf();
    } else {
      if (exception instanceof NotValidException) {
        status = HttpStatus.BAD_REQUEST.valueOf();
      } else {
        if (exception instanceof NotFoundException) {
          status = HttpStatus.NOT_FOUND.valueOf();
        }
      }
    }
    const span = trace ? trace.getSpan(context.active()) : undefined;
    response.status(status).json({
      status: status,
      type: 'about:blank',
      title: title,
      trace_id: span ? span.spanContext().traceId : '',
      span_id: span ? span.spanContext().spanId : '',
      detail: detail,
      path: request.url,
    });
  }
}
