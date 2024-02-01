import { Test, TestingModule } from '@nestjs/testing';
import { ShopifyClientService } from './shopify-client.service';
import { HttpService } from '@nestjs/axios';
import {
  AxiosRequestHeaders,
  AxiosResponse,
  AxiosResponseHeaders,
} from 'axios';
import { of, throwError } from 'rxjs';
import * as fs from 'fs-extra';
import * as path from 'path';

import { ProductsResponse } from '../model/productsResponse';
import { ProductResponse } from '../model/productResponse';

function parseJsonFile(assetPath: string) {
  const rootPath = path.join(__dirname, '../../../../');
  const filePath = path.join(rootPath, assetPath);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

const productsResponse = parseJsonFile(
  './test/assets/product-response.json',
) as ProductsResponse;

const productResponse = parseJsonFile(
  './test/assets/product-response.json',
) as ProductResponse;

describe('ShopifyClientService', () => {
  let service: ShopifyClientService;
  let httpServiceMock: jest.Mocked<HttpService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShopifyClientService,
        {
          provide: HttpService,
          useFactory: () => ({
            get: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<ShopifyClientService>(ShopifyClientService);
    httpServiceMock = module.get(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getItems test cases', () => {
    it('should return ProductsResponse on successful request', async () => {
      const mockProductsResponse = productsResponse;

      httpServiceMock.get.mockReturnValueOnce({
        pipe: jest.fn(() => of(mockProductsResponse)),
      } as any);

      const result = await service.getItems('storeName', 'accessToken');

      expect(result).toEqual(mockProductsResponse);
    });

    it('should handle 500 error and throw an error', async () => {
      const axiosResponse: AxiosResponse = {
        headers: {} as AxiosResponseHeaders,
        data: {},
        status: 500,
        statusText: 'Internal Server Error',
        config: {
          headers: {} as AxiosRequestHeaders,
        },
      };

      httpServiceMock.get.mockReturnValueOnce({
        pipe: jest.fn(() => throwError(() => axiosResponse)),
      } as any);

      await expect(
        service.getItems('storeName', 'accessToken'),
      ).rejects.toEqual({
        config: {
          headers: {},
        },
        data: {},
        headers: {},
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });
  describe('getItem test cases', () => {
    it('should return ProductResponse on successful request', async () => {
      const mockProductsResponse = productResponse;

      httpServiceMock.get.mockReturnValueOnce({
        pipe: jest.fn(() => of(mockProductsResponse)),
      } as any);

      const result = await service.getItem(
        'storeName',
        'accessToken',
        '4494451802165',
      );

      expect(result).toEqual(mockProductsResponse);
    });

    it('should handle 404 and throw an error', async () => {
      const axiosResponse: AxiosResponse = {
        headers: {} as AxiosResponseHeaders,
        data: {},
        status: 404,
        statusText: 'Not found',
        config: {
          headers: {} as AxiosRequestHeaders,
        },
      };

      httpServiceMock.get.mockReturnValueOnce({
        pipe: jest.fn(() => throwError(() => axiosResponse)),
      } as any);

      await expect(
        service.getItem('storeName', 'accessToken', '4494451802165'),
      ).rejects.toEqual({
        config: {
          headers: {},
        },
        data: {},
        headers: {},
        status: 404,
        statusText: 'Not found',
      });
    });
  });
});
