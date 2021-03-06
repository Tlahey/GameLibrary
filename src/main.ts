import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ServiceConfig from './config/server.config';

async function bootstrap() {
  console.log("Version 0.0.2");
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ServiceConfig().CORS_ORIGIN,
    methods: ServiceConfig().CORS_METHODS,
  });
  await app.listen(ServiceConfig().SERVER_PORT);
}
bootstrap();
