import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    if (message.includes('Not Found')) {
      console.log('IN MY FILTER');
      response.status(404).json({
        statusCode: 404,
        message: exception.message,
      });
    } else {
      // Handle other exceptions normally
      response.status(status).json({
        statusCode: status,
        message: exception.message,
      });
    }
  }
}
