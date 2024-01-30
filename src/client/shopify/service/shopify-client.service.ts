import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { lastValueFrom, map } from 'rxjs';
import { ProductsResponse } from '../model/productsResponse';
import { ProductResponse } from '../model/productResponse';
@Injectable()
export class ShopifyClientService {
  constructor(private readonly httpService: HttpService) {}
  async getItems(
    storeName: string,
    accessToken: string,
  ): Promise<ProductsResponse> {
    const shopifyBaseUrl = `https://${storeName}.myshopify.com/admin/api/2023-10/products.json`;
    return await lastValueFrom(
      this.httpService
        .get(shopifyBaseUrl, {
          headers: {
            'X-Shopify-Access-Token': accessToken,
          },
        })
        .pipe(map((res) => res.data)),
    );
  }
  async getItem(
    storeName: string,
    accessToken: string,
    itemId: string,
  ): Promise<ProductResponse> {
    const shopifyBaseUrl = `https://${storeName}.myshopify.com/admin/api/2023-10/products/${itemId}.json`;
    return await lastValueFrom(
      this.httpService
        .get(shopifyBaseUrl, {
          headers: {
            'X-Shopify-Access-Token': accessToken,
          },
        })
        .pipe(map((res) => res.data)),
    );
  }
}
