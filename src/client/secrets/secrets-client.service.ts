import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
@Injectable()
export class SecretsClientService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  async findSecret(subscriptionId: string, name: string): Promise<string> {
    const secretsUrl = this.configService.get<string>('SECRETS_URL');
    const secretsUri = `/${subscriptionId}/${name}`;
    return await lastValueFrom(
      this.httpService
        .get(secretsUrl + secretsUri)
        .pipe(map((res) => res.data)),
    );
  }
}
