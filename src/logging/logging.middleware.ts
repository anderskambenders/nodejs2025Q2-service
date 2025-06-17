import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import LoggingService from './logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggingService) {}

  use(request: Request, response: Response, next: NextFunction) {
    response.on('finish', () => {
      const message = `${request.method} - URL {${
        request.originalUrl
      }} - Body:${JSON.stringify(request.body)} - Query:${JSON.stringify(
        request.query,
      )}\n\n`;
      const statusMessage = response.statusMessage;
      const statusCode = response.statusCode;
      this.logger.log(message);
      if (statusCode >= 400 && statusCode < 500) {
        this.logger.warn(`${statusCode} ${statusMessage}\n`);
      } else if (statusCode >= 500) {
        this.logger.error(`${statusCode} ${statusMessage}\n`);
      } else {
        this.logger.log(`${statusCode} ${statusMessage}\n`);
      }
    });
    next();
  }
}

export default LoggingMiddleware;
