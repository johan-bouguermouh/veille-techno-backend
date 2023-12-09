import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class UniqueConstraintViolationFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if ((exception.driverError as any).code === 'ER_DUP_ENTRY') {
      if (exception.query.includes('INSERT INTO `user`')) {
        return response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Email already exists',
        });
      } else {
        throw exception;
      }
    } else {
      throw exception;
    }
  }
}
