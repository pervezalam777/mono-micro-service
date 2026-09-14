import { Request, Response, NextFunction } from 'express';
import { tokenService } from '../services/TokenService';
import { AuthRequest } from '../types';

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'No authorization header provided',
      },
    });
    return;
  }

  const token = authHeader.replace('Bearer ', '');
  const payload = tokenService.verifyAccessToken(token);

  if (!payload) {
    res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
      },
    });
    return;
  }

  req.user = payload;
  next();
};

export const roleMiddleware = (requiredRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'No authorization header provided',
        },
      });
      return;
    }

    const hasRole = req.user.roles.some((role) => requiredRoles.includes(role));

    if (!hasRole) {
      res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions',
        },
      });
      return;
    }

    next();
  };
};
