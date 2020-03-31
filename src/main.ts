import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import ServiceConfig from './config/server.config';
import DBConfiguration from './config/database.config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ServiceConfig().CORS_ORIGIN,
    methods: ServiceConfig().CORS_METHODS,
  })
  console.log(DBConfiguration());
  await app.listen(ServiceConfig().SERVER_PORT);
}
bootstrap();
