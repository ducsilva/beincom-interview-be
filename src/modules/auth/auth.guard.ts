import { Injectable } from '@nestjs/common';
import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { role: string };
    }
  }
}
@Injectable()
export class RoleGuard implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  }
}
