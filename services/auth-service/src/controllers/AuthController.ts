import { Request, Response } from 'express';
import { authService } from '../services/AuthService';
import { AuthRequest } from '../types';

export const register = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const tokens = await authService.register({
      email,
      password,
      firstName,
      lastName,
    });

    res.status(201).json({
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: error.message || 'REGISTER_FAILED',
        message: error.message || 'Registration failed',
      },
    });
  }
};

export const login = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const tokens = await authService.login(email, password);

    res.status(200).json({
      data: tokens,
    });
  } catch (error: any) {
    res.status(401).json({
      error: {
        code: error.message || 'LOGIN_FAILED',
        message: error.message || 'Invalid credentials',
      },
    });
  }
};

export const refreshToken = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    const tokens = await authService.refreshToken(refreshToken);

    res.status(200).json({
      data: tokens,
    });
  } catch (error: any) {
    res.status(401).json({
      error: {
        code: error.message || 'REFRESH_FAILED',
        message: error.message || 'Invalid refresh token',
      },
    });
  }
};

export const verifyToken = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      res.status(400).json({
        error: {
          code: 'NO_TOKEN',
          message: 'No token provided',
        },
      });
      return;
    }

    const isValid = authService.verifyToken(token);

    res.status(200).json({
      data: { isValid },
    });
  } catch (error: any) {
    res.status(400).json({
      error: {
        code: error.message || 'VERIFY_FAILED',
        message: error.message || 'Token verification failed',
      },
    });
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'No user found in token',
        },
      });
      return;
    }

    res.status(200).json({
      data: {
        id: req.user.id,
        email: req.user.email,
        roles: req.user.roles,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      error: {
        code: error.message || 'INTERNAL_ERROR',
        message: error.message || 'Internal server error',
      },
    });
  }
};
