import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import * as YAML from 'yamljs';
import * as swaggerUi from 'swagger-ui-express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  const port = parseInt(process.env.PORT) || 4000;
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}
bootstrap();
