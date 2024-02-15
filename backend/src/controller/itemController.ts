import { Controller, Get, Logger, Param } from '@nestjs/common';
import { AppService } from '../service/app.service';
import { ProductResponse } from '../client/shopify/model/productResponse';
import { ProductsResponse } from '../client/shopify/model/productsResponse';

@Controller('/items')
export class ItemController {
  private readonly logger = new Logger(ItemController.name);
  constructor(private readonly appService: AppService) {}

  @Get('/')
  async getItems(): Promise<ProductsResponse> {
    return this.appService.getItems();
  }
  @Get('/:id')
  async getItem(@Param('id') id: string): Promise<ProductResponse> {
    this.logger.debug(`This is the id: ${id}`);
    return this.appService.getItem(id);
  }
}
