import { Test, TestingModule } from '@nestjs/testing';
import { ClientExceptionInterceptor } from './clientException.interceptor';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotValidException } from '../../exception/notValidException';
import { NotFoundException } from '../../exception/notFoundException';
import { NotAuthorizedException } from '../../exception/notAuthorizedException';
import { ExtensionException } from '../../exception/extensionException';

describe('ClientExceptionInterceptor', () => {
  let interceptor: ClientExceptionInterceptor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientExceptionInterceptor],
    }).compile();

    interceptor = module.get<ClientExceptionInterceptor>(
      ClientExceptionInterceptor,
    );
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should handle 400 error and throw NotValidException', (done) => {
    const mockError = {
      response: {
        status: 400,
        data: 'some data',
      },
    };

    const handler = {
      handle: () => throwError(() => mockError),
    };

    const obs = interceptor.intercept(null, handler as any) as Observable<any>;

    obs
      .pipe(
        catchError((error) => {
          expect(error instanceof NotValidException).toBe(true);
          expect(error.title).toBe('Not valid');
          expect(error.detail).toBe('some data');
          done();
          return of(null);
        }),
      )
      .subscribe();
  });

  it('should handle 404 error and throw NotFoundException', (done) => {
    const mockError = {
      response: {
        status: 404,
        data: 'some data',
      },
    };

    const handler = {
      handle: () => throwError(() => mockError),
    };

    const obs = interceptor.intercept(null, handler as any) as Observable<any>;

    obs
      .pipe(
        catchError((error) => {
          expect(error instanceof NotFoundException).toBe(true);
          expect(error.title).toBe('Not found');
          expect(error.detail).toBe('some data');
          done();
          return of(null);
        }),
      )
      .subscribe();
  });

  it('should handle 401 error and throw NotAuthorized', (done) => {
    const mockError = {
      response: {
        status: 401,
        data: 'some data',
      },
    };

    const handler = {
      handle: () => throwError(() => mockError),
    };

    const obs = interceptor.intercept(null, handler as any) as Observable<any>;

    obs
      .pipe(
        catchError((error) => {
          expect(error instanceof NotAuthorizedException).toBe(true);
          expect(error.title).toBe('Not authorized');
          expect(error.detail).toBe('some data');
          done();
          return of(null);
        }),
      )
      .subscribe();
  });

  it('should handle 500 error and throw ExtensionException', (done) => {
    const mockError = {
      response: {
        status: 500,
        data: 'some data',
      },
    };

    const handler = {
      handle: () => throwError(() => mockError),
    };

    const obs = interceptor.intercept(null, handler as any) as Observable<any>;

    obs
      .pipe(
        catchError((error) => {
          expect(error instanceof ExtensionException).toBe(true);
          expect(error.title).toBe('Unknown error');
          expect(error.detail).toBe('some data');
          done();
          return of(null);
        }),
      )
      .subscribe();
  });
});
