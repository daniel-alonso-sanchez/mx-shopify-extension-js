import { Controller, Get, Param, Logger, Headers, StreamableFile, Header } from '@nestjs/common';
import { AppService } from '../service/app.service';
import { ProductResponse } from '../client/shopify/model/productResponse';
import { ProductsResponse } from '../client/shopify/model/productsResponse';
import { SchematicService } from '../service/schematic.service';

@Controller()
export class SchematicController {
  private readonly logger = new Logger(SchematicController.name);
  constructor(private readonly schematicService: SchematicService) {}

  @Get('/schematic.json')
  @Header('content-type', 'application/json')
  getSchematic(): StreamableFile {
    return this.schematicService.getSchematic();
  }
}
