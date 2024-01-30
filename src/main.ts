import instrumentation from './instrumentation/instrumentation';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
instrumentation.init();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
