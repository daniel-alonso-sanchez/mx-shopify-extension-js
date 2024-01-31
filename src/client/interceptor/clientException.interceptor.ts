import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotValidException } from '../../exception/notValidException';
import { NotFoundException } from '../../exception/notFoundException';
import { NotAuthorizedException } from '../../exception/notAuthorizedException';
import { ExtensionException } from '../../exception/extensionException';

@Injectable()
export class ClientExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error.response && error.response.status) {
          const status = error.response.status;

          if (status === 400) {
            return throwError(
              () => new NotValidException('Not valid', error.response.data),
            );
          }

          if (status === 404) {
            return throwError(
              () => new NotFoundException('Not found', error.response.data),
            );
          }

          if (status === 401) {
            return throwError(
              () =>
                new NotAuthorizedException(
                  'Not authorized',
                  error.response.data,
                ),
            );
          }
        }

        return throwError(
          () => new ExtensionException('Unknown error', error.response.data),
        );
      }),
    );
  }
}
