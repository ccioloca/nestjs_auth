import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from './role.enum';

export const CurrentUser = createParamDecorator(
  (data: string = Role.User, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest();
    return user;
  },
);