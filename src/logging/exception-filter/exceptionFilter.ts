import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import LoggingService from '../logging.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly loggerService: LoggingService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const context = host.switchToHttp();
    let statusCode = exception.getStatus();
    let exceptionMessage = exception.message;
    if (!(exception instanceof HttpException)) {
      statusCode = 500;
      exceptionMessage = 'Internal server error';
    }
    const errorMessage = `Message: ${exceptionMessage} - Status Code: ${statusCode}`;
    this.loggerService.error(errorMessage);

    const responseBody = {
      statusCode,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(context.getRequest<Request>()),
    };

    httpAdapter.reply(
      context.getResponse<Response>(),
      responseBody,
      statusCode,
    );
  }
}

export default HttpExceptionFilter;
