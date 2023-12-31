import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../user/users.entity';

export const UserAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
