import { Test, TestingModule } from '@nestjs/testing';
import { ClientExceptionInterceptor } from './clientException.interceptor';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotValidException } from '../../exception/notValidException';
import { NotFoundException } from '../../exception/notFoundException';
import { NotAuthorizedException } from '../../exception/notAuthorizedException';
import { ExtensionException } from '../../exception/extensionException';

function createTest(
  status: number,
  exceptionType: any,
  exceptionTitle: string,
  exceptionDetail: string,
) {
  return (done: () => void) => {
    const mockError = {
      response: {
        status,
        data: 'some data',
      },
    };

    const handler = {
      handle: () => throwError(() => mockError),
    };

    const interceptor = new ClientExceptionInterceptor();
    const obs = interceptor.intercept(null, handler as any) as Observable<any>;

    obs
      .pipe(
        catchError((error) => {
          expect(error instanceof exceptionType).toBe(true);
          expect(error.title).toBe(exceptionTitle);
          expect(error.detail).toBe(exceptionDetail);
          done();
          return of(null);
        }),
      )
      .subscribe();
  };
}

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

  it(
    'should handle 400 error and throw NotValidException',
    createTest(400, NotValidException, 'Not valid', 'some data'),
  );
  it(
    'should handle 404 error and throw NotFoundException',
    createTest(404, NotFoundException, 'Not found', 'some data'),
  );
  it(
    'should handle 401 error and throw NotAuthorizedException',
    createTest(401, NotAuthorizedException, 'Not authorized', 'some data'),
  );
  it(
    'should handle 500 error and throw ExtensionException',
    createTest(500, ExtensionException, 'Unknown error', 'some data'),
  );
});
