import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

// Microservice URLs from environment
const getMicroserviceUrl = (service: 'auth' | 'author' | 'book'): string => {
  const envVarName = `MICROSERVICE_${service.toUpperCase()}_URL`;
  const defaultValue = `http://localhost:${service === 'auth' ? 3000 : service === 'author' ? 3001 : 3002}`;
  return process.env[envVarName] || defaultValue;
};

export const MICROSERVICES = {
  auth: {
    url: getMicroserviceUrl('auth'),
    path: '/api/v1/auth',
  },
  author: {
    url: getMicroserviceUrl('author'),
    path: '/api/v1/authors',
  },
  book: {
    url: getMicroserviceUrl('book'),
    path: '/api/v1/books',
  },
};

// Create axios instances for each microservice
export const microserviceClients: Record<string, AxiosInstance> = {
  auth: axios.create({
    baseURL: MICROSERVICES.auth.url,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
  }),
  author: axios.create({
    baseURL: MICROSERVICES.author.url,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
  }),
  book: axios.create({
    baseURL: MICROSERVICES.book.url,
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
  }),
};

// Request logging interceptor
Object.values(microserviceClients).forEach((client) => {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
      logger.debug(`Forwarding request: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => {
      logger.debug(`Response: ${response.status} ${response.config.url}`);
      return response;
    },
    (error: AxiosError) => {
      logger.error(`Request failed: ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}`);
      return Promise.reject(error);
    }
  );
});

export { logger };
