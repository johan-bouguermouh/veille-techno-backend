import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../user/users.entity';

/**
 * Auth decorator
 * Création d'un decorator pour les routes permettant de récupérer l'id de l'utilisateur connecté en récupérant du token JWT
 */
export const UserAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
