import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')?.[1];
    if (!token) return null;
    const jwtService = new JwtService();
    try {
      const decodedToken = jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      return decodedToken.userId;
    } catch (error) {
      return null;
    }
  },
);
