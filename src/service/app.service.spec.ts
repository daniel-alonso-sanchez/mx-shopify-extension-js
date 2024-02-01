import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { SecretsClientService } from '../client/secrets/secrets-client.service';
import { ShopifyClientService } from '../client/shopify/service/shopify-client.service';
import { ProductsResponse } from '../client/shopify/model/productsResponse';
import { ProductResponse } from '../client/shopify/model/productResponse';
import path from 'path';
import * as fs from 'fs-extra';

function parseJsonFile(assetPath: string) {
  const rootPath = path.join(__dirname, '../../');
  const filePath = path.join(rootPath, assetPath);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

const productsResponse = parseJsonFile(
  './test/assets/product-response.json',
) as ProductsResponse;

const productResponse = parseJsonFile(
  './test/assets/product-response.json',
) as ProductResponse;

const mockSecretsClientService = {
  findSecret: jest.fn(),
};

const mockShopifyClientService = {
  getItems: jest.fn(),
  getItem: jest.fn(),
};

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: SecretsClientService,
          useValue: mockSecretsClientService,
        },
        {
          provide: ShopifyClientService,
          useValue: mockShopifyClientService,
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  describe('getItems and getItem tests', () => {
    it('should invoke get items successfully', async () => {
      mockSecretsClientService.findSecret.mockResolvedValueOnce('mockSecret');
      mockSecretsClientService.findSecret.mockResolvedValueOnce(
        'mockStoreName',
      );
      mockShopifyClientService.getItems.mockResolvedValueOnce(productsResponse);

      const result = await appService.getItems('someSubscriptionId');

      expect(mockSecretsClientService.findSecret).toHaveBeenCalledWith(
        'someSubscriptionId',
        AppService.TOKEN_KEY,
      );
      expect(mockSecretsClientService.findSecret).toHaveBeenCalledWith(
        'someSubscriptionId',
        AppService.STORE_NAME,
      );
      expect(mockShopifyClientService.getItems).toHaveBeenCalledWith(
        'mockStoreName',
        'mockSecret',
      );
      expect(result).toEqual(productsResponse);
    });
    it('should invoke get item successfully', async () => {
      mockSecretsClientService.findSecret.mockResolvedValueOnce('mockSecret');
      mockSecretsClientService.findSecret.mockResolvedValueOnce(
        'mockStoreName',
      );
      mockShopifyClientService.getItem.mockResolvedValueOnce(productResponse);

      const result = await appService.getItem(
        'someSubscriptionId',
        '4494451802165',
      );

      expect(mockSecretsClientService.findSecret).toHaveBeenCalledWith(
        'someSubscriptionId',
        AppService.TOKEN_KEY,
      );
      expect(mockSecretsClientService.findSecret).toHaveBeenCalledWith(
        'someSubscriptionId',
        AppService.STORE_NAME,
      );
      expect(mockShopifyClientService.getItem).toHaveBeenCalledWith(
        'mockStoreName',
        'mockSecret',
        '4494451802165',
      );
      expect(result).toEqual(productResponse);
    });
  });
});
