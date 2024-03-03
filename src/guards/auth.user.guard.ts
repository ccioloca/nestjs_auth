import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user/user.service';

@Injectable()
export class FirebaseAuthGuard extends AuthGuard('firebase-auth') {
    constructor(
        private reflector: Reflector,
    ) {
        super();
    }
// Defines a method named canActivate which takes a parameter context of type ExecutionContext.
canActivate(context: ExecutionContext) {
  // Retrieves the value of the 'public' metadata using reflector from the handler and class associated with the provided execution context.
  const isPublic = this.reflector.getAllAndOverride<boolean>('public', [
      context.getHandler(),
      context.getClass(),
  ]);

  // If the isPublic value is truthy, it means the route is public and allows access without any further checks.
  if (isPublic) {
      return true;
  }

  // If the route is not public, calls the canActivate method of the super class passing on the provided context for additional authorization checks.
  return super.canActivate(context);
}

}