import { Controller, Get, Param, Logger, Headers } from '@nestjs/common';
import { AppService } from '../service/app.service';
import { ProductResponse } from '../client/shopify/model/productResponse';
import { ProductsResponse } from '../client/shopify/model/productsResponse';

@Controller('/items')
export class ItemController {
  private readonly logger = new Logger(ItemController.name);
  constructor(private readonly appService: AppService) {}

  @Get('/')
  async getItems(
    @Headers('subscription-id') subscriptionId: string,
  ): Promise<ProductsResponse> {
    return this.appService.getItems(subscriptionId);
  }
  @Get('/:id')
  async getItem(
    @Param('id') id: string,
    @Headers('subscription-id') subscriptionId: string,
  ): Promise<ProductResponse> {
    this.logger.debug(`This is the id: ${id}`);
    return this.appService.getItem(subscriptionId, id);
  }
}
