import { Injectable, Logger } from '@nestjs/common';
import { SecretsClientService } from '../client/secrets/secrets-client.service';
import { ShopifyClientService } from '../client/shopify/service/shopify-client.service';
import { ProductsResponse } from '../client/shopify/model/productsResponse';
import { ProductResponse } from '../client/shopify/model/productResponse';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  static readonly TOKEN_KEY: string = 'shopify.token';
  static readonly STORE_NAME: string = 'shopify.store.name';
  private readonly logger = new Logger(AppService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly secretsClient: SecretsClientService,
    private readonly shopifyClient: ShopifyClientService,
  ) {}

  async getItems(): Promise<ProductsResponse> {
    const subscriptionId = this.configService.get<string>('SUBSCRIPTION_ID');
    const secret = await this.secretsClient.findSecret(
      subscriptionId,
      AppService.TOKEN_KEY,
    );
    const storeName = await this.secretsClient.findSecret(
      subscriptionId,
      AppService.STORE_NAME,
    );
    this.logger.log(`store: ${storeName}`);
    return this.shopifyClient.getItems(storeName, secret);
  }
  async getItem(itemId: string): Promise<ProductResponse> {
    const subscriptionId = this.configService.get<string>('SUBSCRIPTION_ID');
    const secret = await this.secretsClient.findSecret(
      subscriptionId,
      AppService.TOKEN_KEY,
    );
    const storeName = await this.secretsClient.findSecret(
      subscriptionId,
      AppService.STORE_NAME,
    );
    this.logger.log(`store: ${storeName}`);
    return this.shopifyClient.getItem(storeName, secret, itemId);
  }
}
