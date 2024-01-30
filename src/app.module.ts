import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';
import { HttpModule } from '@nestjs/axios';
import { SecretsClientService } from './client/secrets/secrets-client.service';
import { ConfigModule } from '@nestjs/config';
import { ShopifyClientService } from './client/shopify/service/shopify-client.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ClientExceptionInterceptor } from './client/interceptor/clientException.interceptor';
import { ExceptionToProblemFilter } from './filter/exceptionToProblem.filter';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
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
