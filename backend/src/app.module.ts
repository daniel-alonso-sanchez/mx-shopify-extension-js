import { Module } from '@nestjs/common';
import { ItemController } from './controller/itemController';
import { AppService } from './service/app.service';
import { HttpModule } from '@nestjs/axios';
import { SecretsClientService } from './client/secrets/secrets-client.service';
import { ConfigModule } from '@nestjs/config';
import { ShopifyClientService } from './client/shopify/service/shopify-client.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ClientExceptionInterceptor } from './client/interceptor/clientException.interceptor';
import { ExceptionToProblemFilter } from './filter/exceptionToProblem.filter';
import { SchematicService } from './service/schematic.service';
import { SchematicController } from './controller/schematicController';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';

const ruta = path.join(__dirname, '..', 'dist/public');

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: ruta,
      exclude: ['/api/(.*)'],
    }),
  ],
  controllers: [ItemController, SchematicController],
  providers: [
    AppService,
    SchematicService,
    SecretsClientService,
    ShopifyClientService,
    {
      provide: APP_FILTER,
      useClass: ExceptionToProblemFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClientExceptionInterceptor,
    },
  ],
})
export class AppModule {}
