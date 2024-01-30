import { Test, TestingModule } from '@nestjs/testing';
import { SecretsClientService } from '../../../src/client/secrets/secrets-client.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import * as nock from 'nock'; // Import nock using '* as nock'

describe('SecretsClientService', () => {
  let secretsClientService: SecretsClientService;

  beforeEach(async () => {
    // Basic test module setup
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule, ConfigModule.forRoot()],
      providers: [SecretsClientService],
    }).compile();

    // Get an instance of SecretsClientService
    secretsClientService =
      module.get<SecretsClientService>(SecretsClientService);

    // Configure ConfigService to return a specific URL during tests
    jest
      .spyOn(secretsClientService['configService'], 'get')
      .mockReturnValue('http://mocked-url');
  });

  it('should call the external service and return the result', async () => {
    // Configure nock to intercept the call and simulate a response
    const subscriptionId = 'my_sub_id';
    const name = 'token';
    const expectedResult = 'ok';

    nock('http://mocked-url')
      .get(`/${subscriptionId}/${name}`)
      .reply(200, expectedResult);

    // Call the findSecret method and verify the result
    const result = await secretsClientService.findSecret(subscriptionId, name);

    expect(result).toEqual(expectedResult);
  });
});
