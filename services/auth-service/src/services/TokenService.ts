import jwt from 'jsonwebtoken';
import { UserPayload } from '../types';

interface TokenConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
}

class TokenService {
  private config: TokenConfig;

  constructor() {
    this.config = {
      accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'your-secret-key-change-me',
      refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret-change-me',
      accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || '15m',
      refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || '7d',
    };
  }

  generateAccessToken(user: UserPayload): string {
    return jwt.sign(
      { id: user.id, email: user.email, roles: user.roles },
      this.config.accessTokenSecret,
      { expiresIn: this.config.accessTokenExpiry }
    );
  }

  generateRefreshToken(user: UserPayload): string {
    return jwt.sign(
      { id: user.id },
      this.config.refreshTokenSecret,
      { expiresIn: this.config.refreshTokenExpiry }
    );
  }

  verifyAccessToken(token: string): UserPayload | null {
    try {
      const decoded = jwt.verify(token, this.config.accessTokenSecret);
      return decoded as UserPayload;
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token: string): UserPayload | null {
    try {
      const decoded = jwt.verify(token, this.config.refreshTokenSecret);
      return decoded as UserPayload;
    } catch (error) {
      return null;
    }
  }
}

export const tokenService = new TokenService();
