import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { ExceptionToProblemFilter } from './exceptionToProblem.filter';
import { NotFoundException } from '../exception/notFoundException';
import { NotValidException } from '../exception/notValidException';
import { NotAuthorizedException } from '../exception/notAuthorizedException';
import { ExtensionException } from '../exception/extensionException';

const mockJson = jest.fn();
const mockStatus = jest.fn().mockImplementation(() => ({
  json: mockJson,
}));
const mockGetResponse = jest.fn().mockImplementation(() => ({
  status: mockStatus,
}));
const mockGetRequest = jest.fn().mockImplementation(() => ({
  url: 'http://mocked-url',
}));
const mockHttpArgumentsHost = jest.fn().mockImplementation(() => ({
  getResponse: mockGetResponse,
  getRequest: mockGetRequest,
}));

const mockArgumentsHost = {
  switchToHttp: mockHttpArgumentsHost,
  getArgByIndex: jest.fn(),
  getArgs: jest.fn(),
  getType: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
};

function getProblemResponseObject(statusCode: number) {
  return {
    detail: 'desc',
    path: 'http://mocked-url',
    span_id: '',
    status: statusCode,
    title: 'title',
    trace_id: '',
    type: 'about:blank',
  };
}

function evaluateExpectations(expectedStatus: HttpStatus) {
  expect(mockHttpArgumentsHost).toBeCalledTimes(1);
  expect(mockHttpArgumentsHost).toBeCalledWith();
  expect(mockGetResponse).toBeCalledTimes(1);
  expect(mockGetResponse).toBeCalledWith();
  expect(mockStatus).toBeCalledTimes(1);
  expect(mockStatus).toBeCalledWith(expectedStatus);
  expect(mockJson).toBeCalledTimes(1);
  expect(mockJson).toBeCalledWith(
    getProblemResponseObject(expectedStatus.valueOf()),
  );
}

describe('Exception To Problem Mapper Filter', () => {
  let service: ExceptionToProblemFilter;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExceptionToProblemFilter],
    }).compile();
    service = module.get<ExceptionToProblemFilter>(ExceptionToProblemFilter);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a not found error response, when not found exception is thrown', () => {
    service.catch(new NotFoundException('title', 'desc'), mockArgumentsHost);
    evaluateExpectations(HttpStatus.NOT_FOUND);
  });
  it('should return a not valid error response, when not valid exception is thrown', () => {
    service.catch(new NotValidException('title', 'desc'), mockArgumentsHost);
    evaluateExpectations(HttpStatus.BAD_REQUEST);
  });
  it('should return a not valid error response, when not valid exception is thrown', () => {
    service.catch(
      new NotAuthorizedException('title', 'desc'),
      mockArgumentsHost,
    );
    evaluateExpectations(HttpStatus.UNAUTHORIZED);
  });
  it('should return an internal server response, when generic exception is thrown', () => {
    service.catch(new ExtensionException('title', 'desc'), mockArgumentsHost);
    evaluateExpectations(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
