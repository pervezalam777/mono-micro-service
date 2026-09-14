import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/UserRepository';
import { tokenService } from './TokenService';
import { UserInput, TokenPair } from '../types';

interface AuthService {
  register(data: UserInput): Promise<TokenPair>;
  login(email: string, password: string): Promise<TokenPair>;
  logout(refreshToken: string): Promise<void>;
  refreshToken(refreshToken: string): Promise<TokenPair>;
  verifyToken(token: string): boolean;
}

class AuthServiceImpl implements AuthService {
  async register(data: UserInput): Promise<TokenPair> {
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = await userRepository.create(data);

    const payload = {
      id: user._id,
      email: user.email,
      roles: user.roles,
    };

    return {
      accessToken: tokenService.generateAccessToken(payload),
      refreshToken: tokenService.generateRefreshToken(payload),
    };
  }

  async login(email: string, password: string): Promise<TokenPair> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Since userRepository uses .lean(), user is a plain object without Mongoose methods
    // Use bcrypt directly for password comparison
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const payload = {
      id: user._id,
      email: user.email,
      roles: user.roles,
    };

    return {
      accessToken: tokenService.generateAccessToken(payload),
      refreshToken: tokenService.generateRefreshToken(payload),
    };
  }

  async logout(refreshToken: string): Promise<void> {
    // In a real implementation, add token to blacklist in Redis
    // For now, this is a no-op as JWTs are stateless
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    const payload = tokenService.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new Error('Invalid refresh token');
    }

    const user = await userRepository.findById(payload.id);
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    const newPayload = {
      id: user._id,
      email: user.email,
      roles: user.roles,
    };

    return {
      accessToken: tokenService.generateAccessToken(newPayload),
      refreshToken: tokenService.generateRefreshToken(newPayload),
    };
  }

  verifyToken(token: string): boolean {
    return tokenService.verifyAccessToken(token) !== null;
  }
}

export const authService = new AuthServiceImpl();
