import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import * as YAML from 'yamljs';
import * as swaggerUi from 'swagger-ui-express';
import * as path from 'path';
import LoggingService from './logging/logging.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggingService(),
  });
  const logger = app.get(LoggingService);
  app.useLogger(logger);
  process.on('uncaughtException', (err) => {
    logger.error(`Caught Exception - ${err.message}`);
    process.exit(1);
  });
  process.on('unhandledRejection', (reason) => {
    logger.warn(`Rejection at promise - ${reason}`);
  });
  const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  const port = parseInt(process.env.PORT) || 4000;
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}
bootstrap();
