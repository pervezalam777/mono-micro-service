import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../types';

interface ErrorBody {
  code: string;
  message: string;
  details?: string[];
}

export const validate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorBody: ErrorBody = {
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: errors.array().map((e) => e.msg),
    };

    res.status(400).json({ error: errorBody });
    return;
  }

  next();
};
