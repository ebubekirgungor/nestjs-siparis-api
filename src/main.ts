import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ProductsModule } from './products/products.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    ProductsModule,
    new FastifyAdapter(),
  );
  await app.listen(3000);
}
bootstrap();
