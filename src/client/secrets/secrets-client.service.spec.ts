import { Test, TestingModule } from '@nestjs/testing';
import { SecretsClientService } from './secrets-client.service';
import { HttpService, HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('SecretsClientService', () => {
  let secretsClientService: SecretsClientService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [SecretsClientService, ConfigService],
    }).compile();

    secretsClientService =
      module.get<SecretsClientService>(SecretsClientService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(secretsClientService).toBeDefined();
  });

  describe('findSecret', () => {
    it('should return the secret', async () => {
      const subscriptionId = 'testSubscriptionId';
      const name = 'testSecretName';
      const secretsUrl = 'https://example.com/secrets';
      const expectedSecret = 'testSecretValue';

      jest.spyOn(configService, 'get').mockReturnValue(secretsUrl);
      jest.spyOn(httpService, 'get').mockReturnValue(
        of({
          data: expectedSecret,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {},
        } as AxiosResponse<string>),
      );

      const result = await secretsClientService.findSecret(
        subscriptionId,
        name,
      );

      expect(configService.get).toHaveBeenCalledWith('SECRETS_URL');
      expect(httpService.get).toHaveBeenCalledWith(
        `${secretsUrl}/${subscriptionId}/${name}`,
      );
      expect(result).toEqual(expectedSecret);
    });
  });
});
