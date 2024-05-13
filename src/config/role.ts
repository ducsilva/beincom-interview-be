import { SetMetadata } from '@nestjs/common';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  ALL = 'ALL',
}

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
