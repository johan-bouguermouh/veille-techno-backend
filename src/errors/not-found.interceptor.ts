import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  NotFoundException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class NotFoundInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (
          err instanceof NotFoundException &&
          err.message.includes('Not Found')
        ) {
          throw new NotFoundException('Not Found', 'NOT_FOUND');
        } else {
          return throwError(err);
        }
      }),
    );
  }
}
