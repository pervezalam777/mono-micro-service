import { User, TokenPair } from '../types';
import api from './api';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  async register(data: RegisterData): Promise<TokenPair> {
    const response = await api.post(`/auth/register`, data);
    return response.data.data;
  },

  async login(data: LoginData): Promise<TokenPair> {
    const response = await api.post(`/auth/login`, data);
    return response.data.data;
  },

  async logout(): Promise<void> {
    await api.post(`/auth/logout`);
  },

  async getMe(): Promise<User> {
    const response = await api.get(`/auth/me`);
    return response.data.data;
  },

  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await api.get(`/auth/verify-token`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data.isValid;
    } catch {
      return false;
    }
  },
};
